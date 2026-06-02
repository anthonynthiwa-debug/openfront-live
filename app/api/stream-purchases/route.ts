import { NextRequest, NextResponse } from 'next/server';

const KEYSTONE_ENDPOINT = process.env.KEYSTONE_ENDPOINT || 'http://localhost:3000/api/graphql';

async function executeQuery(query: string, variables?: Record<string, any>) {
  // For now, execute without authentication
  // In production, you would get and validate a session
  
  const response = await fetch(KEYSTONE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL errors: ${data.errors.map((e: any) => e.message).join(', ')}`);
  }

  return data.data;
}

// GET - Fetch stream purchases for a session (merchant view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const role = searchParams.get('role') || 'customer'; // 'merchant' or 'customer'

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const query = `
      query GetStreamPurchases($sessionId: ID!) {
        streamPurchases(
          where: { liveSession: { id: { equals: $sessionId } } }
          orderBy: { purchasedAt: desc }
        ) {
          id
          streamProduct { id product { title } }
          customer { id name email }
          customerEmail
          quantity
          unitPrice
          totalAmount
          currency { code symbol }
          paymentStatus
          purchasedAt
          notificationSent
        }
      }
    `;

    const data = await executeQuery(query, { sessionId });

    return NextResponse.json(
      { purchases: data.streamPurchases },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Stream purchases fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stream purchases' },
      { status: 500 }
    );
  }
}

// POST - Record a new stream purchase
export async function POST(request: NextRequest) {
  try {
    const { sessionId, streamProductId, quantity, unitPrice, currencyId, customerEmail } = await request.json();

    if (!sessionId || !streamProductId || !quantity || !unitPrice || !currencyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const totalAmount = quantity * unitPrice;

    const mutation = `
      mutation CreateStreamPurchase(
        $sessionId: ID!
        $productId: ID!
        $quantity: Int!
        $unitPrice: Int!
        $totalAmount: Int!
        $currencyId: ID!
        $email: String
        $customerId: ID
      ) {
        createStreamPurchase(data: {
          liveSession: { connect: { id: $sessionId } }
          streamProduct: { connect: { id: $productId } }
          quantity: $quantity
          unitPrice: $unitPrice
          totalAmount: $totalAmount
          currency: { connect: { id: $currencyId } }
          customerEmail: $email
          ${customerId ? 'customer: { connect: { id: $customerId } }' : ''}
          paymentStatus: "pending"
          purchasedAt: "${new Date().toISOString()}"
        }) {
          id
          streamProduct { id }
          quantity
          totalAmount
          paymentStatus
          purchasedAt
        }
      }
    `;

    const data = await executeQuery(mutation, {
      sessionId,
      productId: streamProductId,
      quantity,
      unitPrice,
      totalAmount,
      currencyId,
      email: customerEmail,
    });

    return NextResponse.json(
      { purchase: data.createStreamPurchase },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Stream purchase creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create stream purchase' },
      { status: 500 }
    );
  }
}

// PATCH - Update stream purchase payment status
export async function PATCH(request: NextRequest) {
  try {
    const { purchaseId, paymentStatus, stripePaymentIntentId } = await request.json();

    if (!purchaseId || !paymentStatus) {
      return NextResponse.json(
        { error: 'purchaseId and paymentStatus are required' },
        { status: 400 }
      );
    }

    const updates: any = { paymentStatus };
    if (stripePaymentIntentId) {
      updates.stripePaymentIntentId = stripePaymentIntentId;
    }
    if (paymentStatus === 'completed') {
      updates.completedAt = new Date().toISOString();
    }

    const mutation = `
      mutation UpdateStreamPurchase($id: ID!, $data: StreamPurchaseUpdateArgs!) {
        updateStreamPurchase(where: { id: $id }, data: $data) {
          id
          paymentStatus
          completedAt
          notificationSent
        }
      }
    `;

    const data = await executeQuery(mutation, {
      id: purchaseId,
      data: updates,
    });

    return NextResponse.json(
      { purchase: data.updateStreamPurchase },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Stream purchase update error:', error);
    return NextResponse.json(
      { error: 'Failed to update stream purchase' },
      { status: 500 }
    );
  }
}
