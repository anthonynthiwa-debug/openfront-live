'use client';

import { useCallback, useEffect, useState } from 'react';

interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  expiresIn: number;
}

interface UseAgoraConnectionParams {
  channelName: string;
  role: 'publisher' | 'subscriber';
  uid?: number;
  onTokenExpiring?: (expiresIn: number) => void;
}

/**
 * Hook to manage Agora connection and token generation
 */
export function useAgoraConnection({
  channelName,
  role,
  uid = 0,
  onTokenExpiring,
}: UseAgoraConnectionParams) {
  const [token, setToken] = useState<string | null>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tokenExpireTime, setTokenExpireTime] = useState<number>(0);

  // Generate token on mount or when params change
  useEffect(() => {
    const generateToken = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/agora/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelName,
            role,
            uid,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate token');
        }

        const data: AgoraTokenResponse = await response.json();
        setToken(data.token);
        setAppId(data.appId);
        setTokenExpireTime(Date.now() + data.expiresIn * 1000);

        console.log('[v0] Agora token generated for channel:', channelName);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to generate Agora token');
        setError(error);
        console.error('[v0] Token generation error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (channelName) {
      generateToken();
    }
  }, [channelName, role, uid]);

  // Monitor token expiration
  useEffect(() => {
    if (!tokenExpireTime) return;

    const warningTime = 5 * 60 * 1000; // 5 minutes before expiry
    const checkInterval = 30 * 1000; // Check every 30 seconds

    const timer = setInterval(() => {
      const now = Date.now();
      const timeRemaining = tokenExpireTime - now;

      if (timeRemaining < warningTime && timeRemaining > 0) {
        onTokenExpiring?.(Math.floor(timeRemaining / 1000));
      }
    }, checkInterval);

    return () => clearInterval(timer);
  }, [tokenExpireTime, onTokenExpiring]);

  return {
    token,
    appId,
    loading,
    error,
    tokenExpireTime,
    isTokenValid: token && tokenExpireTime > Date.now(),
  };
}

interface UseAgoraSignalingParams {
  channelName: string;
  userId: string;
}

/**
 * Hook to manage Agora RTM (Real-Time Messaging) for signaling
 */
export function useAgoraSignaling({ channelName, userId }: UseAgoraSignalingParams) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize RTM connection
  useEffect(() => {
    const initRTM = async () => {
      try {
        setLoading(true);
        // RTM initialization would happen here
        // For now, this is a placeholder
        console.log('[v0] RTM initializing for channel:', channelName);
        setConnected(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('RTM initialization failed');
        setError(error);
        console.error('[v0] RTM error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (channelName && userId) {
      initRTM();
    }

    return () => {
      setConnected(false);
    };
  }, [channelName, userId]);

  return {
    connected,
    loading,
    error,
  };
}
