import { NextRequest, NextResponse } from 'next/server';
import { generateAgoraToken, validateAgoraParams } from '@/lib/agora-service';
import { getServerSession } from '@/features/keystone/context';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.itemId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { channelName, uid, role } = await request.json();

    // Validate parameters
    const validation = validateAgoraParams(channelName, uid);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    if (!role || !['publisher', 'subscriber'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "publisher" or "subscriber"' },
        { status: 400 }
      );
    }

    // Generate token
    const token = await generateAgoraToken({
      channelName,
      uid: uid || 0,
      role,
      expirationTimeInSeconds: 3600, // 1 hour
    });

    return NextResponse.json(
      {
        token,
        appId: process.env.AGORA_APP_ID,
        channelName,
        uid: uid || 0,
        expiresIn: 3600,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
