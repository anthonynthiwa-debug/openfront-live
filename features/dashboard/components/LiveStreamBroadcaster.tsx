
'use client';

import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import AgoraRTM, { RTMClient, RTMChannel } from 'agora-rtm-sdk';

interface LiveStreamBroadcasterProps {
  appId: string;
  channel: string;
  token: string;
  uid: number;
  onEnd: () => void;
}

export const LiveStreamBroadcaster: React.FC<LiveStreamBroadcasterProps> = ({
  appId,
  channel,
  token,
  uid,
  onEnd,
}) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [rtmClient, setRtmClient] = useState<RTMClient | null>(null);
  const [rtmChannel, setRtmChannel] = useState<RTMChannel | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      // RTC Init
      const agoraClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
      await agoraClient.setClientRole('host');
      await agoraClient.join(appId, channel, token, uid);

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();

      setClient(agoraClient);
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      if (videoRef.current) {
        videoTrack.play(videoRef.current);
      }

      await agoraClient.publish([audioTrack, videoTrack]);

      // RTM Init
      const rtm = AgoraRTM.createInstance(appId);
      await rtm.login({ uid: String(uid), token: '' }); // token placeholder
      const rtmChan = rtm.createChannel(channel);
      await rtmChan.join();

      setRtmClient(rtm);
      setRtmChannel(rtmChan);
    };

    init();

    return () => {
      localAudioTrack?.close();
      localVideoTrack?.close();
      client?.leave();
      rtmChannel?.leave();
      rtmClient?.logout();
    };
  }, []);

  return (
    <div className="flex flex-col items-center bg-black rounded-lg overflow-hidden">
      <div ref={videoRef} className="w-full aspect-video bg-gray-900" />
      <div className="p-4 flex gap-4">
        <button
          onClick={onEnd}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          End Live Stream
        </button>
      </div>
    </div>
  );
};
