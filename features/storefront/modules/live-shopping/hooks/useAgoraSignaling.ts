'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface PinnedProductData {
  productId: string;
  productTitle: string;
  variantId?: string;
  variantTitle?: string;
  streamPrice?: number;
  discount?: number;
  quantity?: number;
  imageUrl?: string;
  description?: string;
  timestamp: number;
}

interface UseAgoraSignalingParams {
  channelName: string;
  userId: string;
  agoraAppId: string;
  agoraToken: string;
  role: 'publisher' | 'subscriber';
}

/**
 * Hook to manage Agora RTM (Real-Time Messaging) for signaling product pinning
 * Allows broadcasting pinned product updates and receiving them in real-time
 */
export function useAgoraSignaling({
  channelName,
  userId,
  agoraAppId,
  agoraToken,
  role,
}: UseAgoraSignalingParams) {
  const rtmClientRef = useRef<any>(null);
  const rtmChannelRef = useRef<any>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pinnedProduct, setPinnedProduct] = useState<PinnedProductData | null>(null);
  const messageCallbackRef = useRef<((data: PinnedProductData) => void) | null>(null);

  // Initialize RTM connection
  useEffect(() => {
    const initRTM = async () => {
      try {
        setLoading(true);
        
        // Dynamically import Agora RTM SDK
        const { default: AgoraRTM } = await import('agora-rtm');
        
        // Create RTM client
        const rtmClient = AgoraRTM.createInstance(agoraAppId);
        
        // Login to RTM
        await rtmClient.login({
          uid: userId,
          token: agoraToken,
        });
        
        rtmClientRef.current = rtmClient;
        
        // Create channel
        const rtmChannel = rtmClient.createChannel(channelName);
        rtmChannelRef.current = rtmChannel;
        
        // Set up message listener
        rtmChannel.on('ChannelMessage', (message: any, memberId: string) => {
          try {
            const data = JSON.parse(message.text);
            if (data.type === 'productPinned') {
              const pinnedData: PinnedProductData = data.payload;
              setPinnedProduct(pinnedData);
              messageCallbackRef.current?.(pinnedData);
            }
          } catch (err) {
            console.error('[v0] Error parsing RTM message:', err);
          }
        });
        
        // Join channel
        await rtmChannel.join();
        
        setConnected(true);
        console.log('[v0] RTM connected and channel joined:', channelName);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('RTM initialization failed');
        setError(error);
        console.error('[v0] RTM error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (channelName && userId && agoraAppId && agoraToken) {
      initRTM();
    }

    return () => {
      // Cleanup
      if (rtmChannelRef.current) {
        rtmChannelRef.current.leave().catch((err: any) => {
          console.error('[v0] Error leaving RTM channel:', err);
        });
      }
      if (rtmClientRef.current) {
        rtmClientRef.current.logout().catch((err: any) => {
          console.error('[v0] Error logging out from RTM:', err);
        });
      }
      setConnected(false);
    };
  }, [channelName, userId, agoraAppId, agoraToken]);

  // Send pinned product message
  const broadcastPinnedProduct = useCallback(
    async (product: PinnedProductData) => {
      if (!rtmChannelRef.current || !connected) {
        console.warn('[v0] RTM channel not connected');
        return;
      }

      try {
        const message = {
          type: 'productPinned',
          payload: product,
        };

        await rtmChannelRef.current.sendMessage({
          text: JSON.stringify(message),
        });

        setPinnedProduct(product);
        console.log('[v0] Pinned product broadcasted:', product.productId);
      } catch (err) {
        console.error('[v0] Error broadcasting pinned product:', err);
      }
    },
    [connected]
  );

  // Clear pinned product (unpin)
  const clearPinnedProduct = useCallback(async () => {
    if (!rtmChannelRef.current || !connected) {
      console.warn('[v0] RTM channel not connected');
      return;
    }

    try {
      const message = {
        type: 'productPinned',
        payload: null,
      };

      await rtmChannelRef.current.sendMessage({
        text: JSON.stringify(message),
      });

      setPinnedProduct(null);
      console.log('[v0] Pinned product cleared');
    } catch (err) {
      console.error('[v0] Error clearing pinned product:', err);
    }
  }, [connected]);

  // Register callback for pinned product messages
  const onPinnedProductReceived = useCallback(
    (callback: (data: PinnedProductData) => void) => {
      messageCallbackRef.current = callback;
    },
    []
  );

  return {
    connected,
    loading,
    error,
    pinnedProduct,
    broadcastPinnedProduct,
    clearPinnedProduct,
    onPinnedProductReceived,
  };
}
