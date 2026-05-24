
'use client';

import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import AgoraRTM, { RTMClient, RTMChannel } from 'agora-rtm-sdk';

interface LiveStreamPlayerProps {
  appId: string;
  channel: string;
  token: string;
  featuredProduct?: {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
  };
}

export const LiveStreamPlayer: React.FC<LiveStreamPlayerProps> = ({
  appId,
  channel,
  token,
  featuredProduct: initialProduct,
}) => {
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<IRemoteVideoTrack | null>(null);
  const [featuredProduct, setFeaturedProduct] = useState(initialProduct);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    let rtmClient: RTMClient;
    let rtmChannel: RTMChannel;

    const init = async () => {
      // RTC Init
      await agoraClient.setClientRole('audience');
      await agoraClient.join(appId, channel, token);

      agoraClient.on('user-published', async (user, mediaType) => {
        await agoraClient.subscribe(user, mediaType);
        if (mediaType === 'video') {
          const videoTrack = user.videoTrack;
          setRemoteVideoTrack(videoTrack || null);
          if (videoRef.current && videoTrack) {
            videoTrack.play(videoRef.current);
          }
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      // RTM Init
      rtmClient = AgoraRTM.createInstance(appId);
      const uid = String(Math.floor(Math.random() * 10000));
      await rtmClient.login({ uid, token: '' });
      rtmChannel = rtmClient.createChannel(channel);
      await rtmChannel.join();

      rtmChannel.on('ChannelMessage', (message, memberId) => {
        const data = JSON.parse(message.text || '{}');
        if (data.type === 'PRODUCT_UPDATE') {
          setFeaturedProduct(data.product);
        }
        if (data.type === 'FILTER_UPDATE') {
          setActiveFilter(data.filter);
          setTimeout(() => setActiveFilter(null), 10000); // Filter lasts 10s
        }
      });
    };

    init();

    return () => {
      agoraClient.leave();
      rtmChannel?.leave();
      rtmClient?.logout();
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
      <div ref={videoRef} className={`w-full h-full transition-all ${activeFilter ? 'filter blur-[2px] hue-rotate-90' : ''}`} />

      {/* Filter indicator */}
      {activeFilter && (
        <div className="absolute top-16 left-4 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold uppercase animate-pulse">
          Filter: {activeFilter}
        </div>
      )}

      {/* Featured Product Overlay */}
      {featuredProduct && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg flex items-center gap-4 shadow-lg animate-bounce-subtle">
          <img
            src={featuredProduct.thumbnail}
            alt={featuredProduct.title}
            className="w-16 h-16 object-cover rounded"
          />
          <div className="flex-1">
            <h4 className="font-bold text-gray-900">{featuredProduct.title}</h4>
            <p className="text-sm text-gray-600">Featured now!</p>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700 transition-colors">
            Buy Now
          </button>
        </div>
      )}

      <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold uppercase animate-pulse">
        Live
      </div>
    </div>
  );
};
