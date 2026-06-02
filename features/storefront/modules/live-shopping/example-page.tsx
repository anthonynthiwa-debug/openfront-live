'use client';

import { useEffect, useState } from 'react';
import { useAgoraConnection } from '@/features/storefront/modules/live-shopping/hooks/useAgoraConnection';
import { LiveStreamViewer, LiveStreamBroadcaster } from '@/features/storefront/modules/live-shopping/components/LiveStreamViewer';
import { ProductSelector } from '@/features/storefront/modules/live-shopping/components/ProductSelector';
import type { LiveSession, AgoraTokenResponse } from '@/features/storefront/modules/live-shopping/types';
import { AgoraRTCProvider } from 'agora-rtc-react';

interface LiveShoppingPageProps {
  sessionId: string;
  userRole: 'merchant' | 'customer';
}

/**
 * Example integration of live shopping into storefront
 * This page can be added at: /[countryCode]/live/[sessionId]/page.tsx
 */
export default function LiveShoppingPage({ sessionId, userRole }: LiveShoppingPageProps) {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [tokenData, setTokenData] = useState<AgoraTokenResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch session details
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        // Query Keystone GraphQL for session details
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query GetLiveSession($id: ID!) {
                liveSession(where: { id: $id }) {
                  id
                  sessionId
                  title
                  description
                  status
                  agoraChannelName
                  viewerCount
                  totalPurchases
                  merchant { name }
                  createdAt
                }
              }
            `,
            variables: { id: sessionId },
          }),
        });

        const data = await response.json();
        if (data.data?.liveSession) {
          setSession(data.data.liveSession);
        }
      } catch (err) {
        setError('Failed to load session');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  // Generate Agora token
  const { token, appId, isTokenValid } = useAgoraConnection({
    channelName: session?.agoraChannelName || '',
    role: userRole,
    uid: Math.floor(Math.random() * 1000),
    onTokenExpiring: (secondsRemaining) => {
      console.warn(`[v0] Agora token expiring in ${secondsRemaining} seconds`);
    },
  });

  useEffect(() => {
    if (token && appId && session?.agoraChannelName) {
      setTokenData({
        token,
        appId,
        channelName: session.agoraChannelName,
        uid: Math.floor(Math.random() * 1000),
        expiresIn: 3600,
      });
    }
  }, [token, appId, session?.agoraChannelName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-white">Loading stream...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-red-500">{error || 'Stream not found'}</div>
      </div>
    );
  }

  if (!isTokenValid || !tokenData) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-slate-400">Initializing connection...</div>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={undefined}>
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-4 py-4">
          <h1 className="text-2xl font-bold text-white">{session.title}</h1>
          <p className="text-slate-400 mt-1">{session.description}</p>
          <div className="flex gap-6 mt-3 text-sm">
            <div className="text-slate-300">
              <span className="font-semibold">Merchant:</span> {session.merchant?.name}
            </div>
            <div className="text-slate-300">
              <span className="font-semibold">Viewers:</span> {session.viewerCount}
            </div>
            <div className="text-slate-300">
              <span className="font-semibold">Purchases:</span> {session.totalPurchases}
            </div>
            <div className={`px-3 py-1 rounded ${
              session.status === 'active' 
                ? 'bg-red-900/30 text-red-400' 
                : 'bg-slate-700 text-slate-300'
            }`}>
              {session.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Stream viewer/broadcaster */}
            <div className="lg:col-span-2">
              {userRole === 'merchant' ? (
                <LiveStreamBroadcaster
                  sessionId={session.id}
                  channelName={session.agoraChannelName}
                  userId={Math.floor(Math.random() * 1000)}
                  agoraAppId={tokenData.appId}
                  agoraToken={tokenData.token}
                  className="h-96 rounded-lg border border-slate-700"
                  onBroadcastStart={() => {
                    console.log('[v0] Broadcast started');
                  }}
                  onBroadcastEnd={() => {
                    console.log('[v0] Broadcast ended');
                  }}
                />
              ) : (
                <LiveStreamViewer
                  sessionId={session.id}
                  channelName={session.agoraChannelName}
                  userId={Math.floor(Math.random() * 1000)}
                  agoraAppId={tokenData.appId}
                  agoraToken={tokenData.token}
                  className="h-96 rounded-lg border border-slate-700"
                />
              )}

              {/* Stream info below video */}
              <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">About this stream</h3>
                <p className="text-slate-400">{session.description}</p>
              </div>
            </div>

            {/* Sidebar - Product selector (merchant) or purchase info (customer) */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              {userRole === 'merchant' ? (
                <ProductSelector
                  sessionId={session.id}
                  onProductSelected={(product) => {
                    console.log('[v0] Product selected:', product);
                  }}
                  onProductRemoved={(productId) => {
                    console.log('[v0] Product removed:', productId);
                  }}
                />
              ) : (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Featured Products</h3>
                  <p className="text-slate-400 text-sm">
                    Products featured in this stream appear here. Click to purchase or add to cart.
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-slate-500 text-sm">Products loading...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AgoraRTCProvider>
  );
}
