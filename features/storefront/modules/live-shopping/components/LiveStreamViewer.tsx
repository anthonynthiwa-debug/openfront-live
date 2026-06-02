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

interface LiveStreamViewerProps {
  sessionId: string;
  channelName: string;
  userId: number;
  agoraAppId: string;
  agoraToken: string;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Component for customers to view a live stream
 */
export function LiveStreamViewer({
  sessionId,
  channelName,
  userId,
  agoraAppId,
  agoraToken,
  onError,
  className = '',
}: LiveStreamViewerProps) {
  const client = useClient();
  const remoteUsers = useRemoteUsers();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      client?.leave();
    };
  }, [client, channelName, agoraToken, userId, agoraAppId, onError]);

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
        <div className="grid grid-cols-1 gap-2 p-2">
          {remoteUsers.map((user) => (
            <RemoteUser key={user.uid} user={user} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-96 bg-slate-800">
          <div className="text-slate-400">Waiting for broadcast...</div>
        </div>
      )}
    </div>
  );
}

interface LiveStreamBroadcasterProps {
  sessionId: string;
  channelName: string;
  userId: number;
  agoraAppId: string;
  agoraToken: string;
  onError?: (error: Error) => void;
  onBroadcastStart?: () => void;
  onBroadcastEnd?: () => void;
  className?: string;
}

/**
 * Component for merchants to broadcast a live stream
 */
export function LiveStreamBroadcaster({
  sessionId,
  channelName,
  userId,
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
      setBroadcasting(false);
      onBroadcastEnd?.();
      setLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stop broadcast');
      setError(error);
      onError?.(error);
      console.error('[v0] Failed to stop broadcast:', error);
    }
  }, [client, localCameraTrack, localMicrophoneTrack, onError, onBroadcastEnd]);

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
