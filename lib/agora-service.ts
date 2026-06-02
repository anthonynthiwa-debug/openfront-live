'use server';

import { AccessToken, RtcTokenBuilder } from 'agora-token';

const APP_ID = process.env.AGORA_APP_ID || '';
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';

if (!APP_ID || !APP_CERTIFICATE) {
  console.warn(
    '[v0] Agora credentials not configured. Set AGORA_APP_ID and AGORA_APP_CERTIFICATE environment variables.'
  );
}

interface TokenGenerationParams {
  channelName: string;
  uid: number;
  role: 'publisher' | 'subscriber';
  expirationTimeInSeconds?: number;
}

/**
 * Generates an Agora RTC token for a user to join a channel
 */
export async function generateAgoraToken({
  channelName,
  uid,
  role,
  expirationTimeInSeconds = 3600, // 1 hour default
}: TokenGenerationParams): Promise<string> {
  if (!APP_ID || !APP_CERTIFICATE) {
    throw new Error(
      'Agora credentials not configured. Please set AGORA_APP_ID and AGORA_APP_CERTIFICATE environment variables.'
    );
  }

  try {
    const tokenRole =
      role === 'publisher'
        ? RtcTokenBuilder.RolePublisher
        : RtcTokenBuilder.RoleSubscriber;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      tokenRole,
      Math.floor(Date.now() / 1000) + expirationTimeInSeconds
    );

    return token;
  } catch (error) {
    console.error('[v0] Error generating Agora token:', error);
    throw new Error('Failed to generate Agora token');
  }
}

/**
 * Generates Agora RTM (Real-Time Messaging) token for signaling
 */
export async function generateAgoraRTMToken(
  userAccount: string,
  expirationTimeInSeconds: number = 3600
): Promise<string> {
  if (!APP_ID || !APP_CERTIFICATE) {
    throw new Error('Agora credentials not configured');
  }

  try {
    const accessToken = new AccessToken(
      APP_ID,
      APP_CERTIFICATE,
      userAccount,
      Math.floor(Date.now() / 1000) + expirationTimeInSeconds
    );

    accessToken.addPrivilege('login', Math.floor(Date.now() / 1000) + expirationTimeInSeconds);

    return accessToken.build();
  } catch (error) {
    console.error('[v0] Error generating Agora RTM token:', error);
    throw new Error('Failed to generate Agora RTM token');
  }
}

/**
 * Validates Agora channel and token parameters
 */
export function validateAgoraParams(
  channelName: string,
  uid?: number
): { valid: boolean; error?: string } {
  if (!channelName || channelName.length === 0) {
    return { valid: false, error: 'Channel name is required' };
  }

  if (channelName.length > 64) {
    return { valid: false, error: 'Channel name must be 64 characters or less' };
  }

  if (uid !== undefined && (uid < 0 || uid > 4294967295)) {
    return { valid: false, error: 'UID must be between 0 and 4294967295' };
  }

  return { valid: true };
}
