import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/features/keystone/context';

const KEYSTONE_ENDPOINT = process.env.KEYSTONE_ENDPOINT || 'http://localhost:3000/api/graphql';

async function executeQuery(query: string, variables?: Record<string, any>) {
  const session = await getServerSession();
  
  const response = await fetch(KEYSTONE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.itemId && { 'Authorization': `Bearer ${session.itemId}` }),
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

// GET - Fetch active live sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.itemId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const query = `
      query {
        liveSessions(where: { status: { equals: "active" } }) {
          id
          sessionId
          title
          description
          merchant { id name }
          region { id name }
          agoraChannelName
          status
          viewerCount
          totalPurchases
          scheduledStartTime
          actualStartTime
          thumbnailUrl
          createdAt
        }
      }
    `;

    const data = await executeQuery(query);

    return NextResponse.json(
      { sessions: data.liveSessions },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Live sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live sessions' },
      { status: 500 }
    );
  }
}

// POST - Create a new live session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.itemId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, regionId, channelName, scheduledStartTime } = await request.json();

    if (!title || !regionId || !channelName || !scheduledStartTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mutation = `
      mutation CreateLiveSession(
        $title: String!
        $description: String
        $regionId: ID!
        $merchantId: ID!
        $channelName: String!
        $sessionId: String!
        $scheduledStartTime: DateTime!
      ) {
        createLiveSession(data: {
          title: $title
          description: $description
          region: { connect: { id: $regionId } }
          merchant: { connect: { id: $merchantId } }
          agoraChannelName: $channelName
          sessionId: $sessionId
          scheduledStartTime: $scheduledStartTime
          status: "scheduled"
          isActive: false
        }) {
          id
          sessionId
          title
          agoraChannelName
          status
          scheduledStartTime
        }
      }
    `;

    const sessionId = `live_${Date.now()}`;
    const data = await executeQuery(mutation, {
      title,
      description,
      regionId,
      merchantId: session.itemId,
      channelName,
      sessionId,
      scheduledStartTime: new Date(scheduledStartTime).toISOString(),
    });

    return NextResponse.json(
      { session: data.createLiveSession },
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Live session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create live session' },
      { status: 500 }
    );
  }
}
