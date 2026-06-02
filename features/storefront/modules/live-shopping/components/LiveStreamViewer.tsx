'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import AgoraRTC, {
  AgoraRTCProvider,
  useClient,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  useRemoteUsers,
  RemoteUser,
  LocalUser,
} from 'agora-rtc-react';
import { PinnedProductDisplay } from './PinnedProductDisplay';
import { PinnedProductData, useAgoraSignaling } from '../hooks/useAgoraSignaling';

interface LiveStreamViewerProps {
  sessionId: string;
  channelName: string;
  userId: number;
  userIdString: string;
  agoraAppId: string;
  agoraToken: string;
  onError?: (error: Error) => void;
  onBuyClick?: (product: PinnedProductData) => void;
  className?: string;
}

/**
 * Component for customers to view a live stream with pinned product
 */
export function LiveStreamViewer({
  sessionId,
  channelName,
  userId,
  userIdString,
  agoraAppId,
  agoraToken,
  onError,
  onBuyClick,
  className = '',
}: LiveStreamViewerProps) {
  const client = useClient();
  const remoteUsers = useRemoteUsers();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewerCount, setViewerCount] = useState(0);

  // Initialize signaling for pinned product updates
  const {
    connected: signalingConnected,
    pinnedProduct,
    onPinnedProductReceived,
  } = useAgoraSignaling({
    channelName,
    userId: userIdString,
    agoraAppId,
    agoraToken,
    role: 'subscriber',
  });

  // Join channel on mount
  useEffect(() => {
    const joinChannel = async () => {
      try {
        setLoading(true);
        await client.join(agoraAppId, channelName, agoraToken, userId);
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to join stream');
        setError(error);
        onError?.(error);
        console.error('[v0] Failed to join stream:', error);
      }
    };

    if (client && channelName && agoraToken) {
      joinChannel();
    }

    return () => {
      client?.leave().catch((err: any) => {
        console.error('[v0] Error leaving channel:', err);
      });
    };
  }, [client, channelName, agoraToken, userId, agoraAppId, onError]);

  // Update viewer count when remote users change
  useEffect(() => {
    // Viewer count = remote users + 1 (the broadcaster)
    setViewerCount(remoteUsers.length + 1);
  }, [remoteUsers.length]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 ${className}`}>
        <div className="text-white">Connecting to stream...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 ${className}`}>
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={`relative w-full bg-slate-900 ${className}`}>
      {remoteUsers.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Video stream */}
          <div className="grid grid-cols-1 gap-2 p-2">
            {remoteUsers.map((user) => (
              <RemoteUser key={user.uid} user={user} />
            ))}
          </div>

          {/* Pinned product display */}
          {signalingConnected && pinnedProduct && (
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <PinnedProductDisplay
                product={pinnedProduct}
                onBuyClick={() => onBuyClick?.(pinnedProduct)}
              />
            </div>
          )}

          {/* Viewer count badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 rounded-full text-white text-sm font-medium">
            👥 {viewerCount.toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96 bg-slate-800">
          <div className="text-slate-400">Waiting for broadcast...</div>
        </div>
      )}
    </div>
  );
}


/**
 * Component for merchants to broadcast a live stream with product pinning
 */
export function LiveStreamBroadcaster({
  sessionId,
  channelName,
  userId,
  userIdString,
  agoraAppId,
  agoraToken,
  onError,
  onBroadcastStart,
  onBroadcastEnd,
  className = '',
}: LiveStreamBroadcasterProps) {
  const client = useClient();
  const { localCameraTrack } = useLocalCameraTrack();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const [broadcasting, setBroadcasting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize signaling for pinned product broadcasts
  const {
    connected: signalingConnected,
    pinnedProduct,
    broadcastPinnedProduct,
    clearPinnedProduct,
  } = useAgoraSignaling({
    channelName,
    userId: userIdString,
    agoraAppId,
    agoraToken,
    role: 'publisher',
  });

  // Join channel and start broadcast
  const startBroadcast = useCallback(async () => {
    try {
      setLoading(true);
      await client.join(agoraAppId, channelName, agoraToken, userId);
      await localCameraTrack?.play('agora-video-container');
      localMicrophoneTrack?.play();
      setBroadcasting(true);
      onBroadcastStart?.();
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start broadcast');
      setError(error);
      onError?.(error);
      console.error('[v0] Failed to start broadcast:', error);
    }
  }, [client, channelName, agoraToken, userId, agoraAppId, localCameraTrack, localMicrophoneTrack, onError, onBroadcastStart]);

  // Stop broadcast and leave channel
  const stopBroadcast = useCallback(async () => {
    try {
      setLoading(true);
      localCameraTrack?.stop();
      localMicrophoneTrack?.stop();
      await client.leave();
      await clearPinnedProduct();
      setBroadcasting(false);
      onBroadcastEnd?.();
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stop broadcast');
      setError(error);
      onError?.(error);
      console.error('[v0] Failed to stop broadcast:', error);
    }
  }, [client, localCameraTrack, localMicrophoneTrack, onError, onBroadcastEnd, clearPinnedProduct]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 ${className}`}>
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className={`relative w-full bg-slate-900 ${className}`}>
      {broadcasting ? (
        <>
          <div id="agora-video-container" className="w-full h-96 bg-slate-800" />
          
          {/* Pinned product indicator for broadcaster */}
          {pinnedProduct && (
            <div className="absolute top-4 left-4 px-3 py-2 bg-amber-500/20 border border-amber-500/50 rounded text-amber-200 text-sm font-medium flex items-center gap-2">
              <span>📌</span>
              <span>{pinnedProduct.productTitle}</span>
            </div>
          )}
          
          <button
            onClick={stopBroadcast}
            disabled={loading}
            className="absolute bottom-4 right-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Stopping...' : 'Stop Broadcast'}
          </button>
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <button
            onClick={startBroadcast}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Starting...' : 'Start Broadcast'}
          </button>
        </div>
      )}
    </div>
  );
}

interface LiveStreamBroadcasterProps {
  sessionId: string;
  channelName: string;
  userId: number;
  userIdString: string;
  agoraAppId: string;
  agoraToken: string;
  onError?: (error: Error) => void;
  onBroadcastStart?: () => void;
  onBroadcastEnd?: () => void;
  className?: string;
}
