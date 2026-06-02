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

// GET - Fetch stream products for a live session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const query = `
      query GetStreamProducts($sessionId: ID!) {
        streamProducts(where: { liveSession: { id: { equals: $sessionId } } }, orderBy: { sequenceOrder: asc }) {
          id
          product {
            id
            title
            description
          }
          variant {
            id
            title
            sku
          }
          sequenceOrder
          streamPrice
          discount
          impressions
          clicks
          purchases
          quantity
          quantitySold
          isAvailable
          featuredAt
          removedAt
        }
      }
    `;

    const data = await executeQuery(query, { sessionId });

    return NextResponse.json(
      { products: data.streamProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Stream products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stream products' },
      { status: 500 }
    );
  }
}

// POST - Add or update a product in the stream
export async function POST(request: NextRequest) {
  try {
    const { sessionId, productId, variantId, streamPrice, discount, quantity } = await request.json();

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the current max sequence order
    const getMaxSequenceQuery = `
      query GetMaxSequence($sessionId: ID!) {
        streamProducts(
          where: { liveSession: { id: { equals: $sessionId } } }
          orderBy: { sequenceOrder: desc }
          take: 1
        ) {
          sequenceOrder
        }
      }
    `;

    const sequenceData = await executeQuery(getMaxSequenceQuery, { sessionId });
    const maxSequence = sequenceData.streamProducts[0]?.sequenceOrder ?? 0;

    const mutation = `
      mutation CreateStreamProduct(
        $sessionId: ID!
        $productId: ID!
        $variantId: ID
        $streamPrice: Int
        $discount: Int
        $quantity: Int!
        $sequenceOrder: Int!
      ) {
        createStreamProduct(data: {
          liveSession: { connect: { id: $sessionId } }
          product: { connect: { id: $productId } }
          ${variantId ? 'variant: { connect: { id: $variantId } }' : ''}
          streamPrice: $streamPrice
          discount: $discount
          quantity: $quantity
          sequenceOrder: $sequenceOrder
          isAvailable: true
          featuredAt: "${new Date().toISOString()}"
        }) {
          id
          product { id title }
          sequenceOrder
          streamPrice
          quantity
          isAvailable
        }
      }
    `;

    const data = await executeQuery(mutation, {
      sessionId,
      productId,
      variantId,
      streamPrice,
      discount: discount || 0,
      quantity: quantity || 999,
      sequenceOrder: maxSequence + 1,
    });

    return NextResponse.json(
      { product: data.createStreamProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Stream product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create stream product' },
      { status: 500 }
    );
  }
}

// PATCH - Update stream product availability or metrics
export async function PATCH(request: NextRequest) {
  try {
    const { productId, updates } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    const mutation = `
      mutation UpdateStreamProduct($id: ID!, $data: StreamProductUpdateArgs!) {
        updateStreamProduct(where: { id: $id }, data: $data) {
          id
          isAvailable
          impressions
          clicks
          purchases
          quantity
          quantitySold
        }
      }
    `;

    const data = await executeQuery(mutation, {
      id: productId,
      data: updates,
    });

    return NextResponse.json(
      { product: data.updateStreamProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Stream product update error:', error);
    return NextResponse.json(
      { error: 'Failed to update stream product' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product from stream
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    const mutation = `
      mutation DeleteStreamProduct($id: ID!) {
        deleteStreamProduct(where: { id: $id }) {
          id
        }
      }
    `;

    await executeQuery(mutation, { id: productId });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Stream product deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete stream product' },
      { status: 500 }
    );
  }
}
