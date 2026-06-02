'use client';

import React, { useState } from 'react';

interface LiveStreamEnhancedViewerProps {
  title: string;
  hostName: string;
  hostAvatar?: string;
  viewerCount: number;
  category: string;
  pinnedProduct?: {
    title: string;
    price: number;
    discount?: number;
    image?: string;
    quantity?: number;
  };
  onBuyClick?: () => void;
  onChatSend?: (message: string) => void;
  className?: string;
}

/**
 * Enhanced viewer interface with live stream, pinned products, and engagement features
 * Inspired by TalkShop.Live design
 */
export function LiveStreamEnhancedViewer({
  title,
  hostName,
  hostAvatar,
  viewerCount,
  category,
  pinnedProduct,
  onBuyClick,
  onChatSend,
  className = '',
}: LiveStreamEnhancedViewerProps) {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ author: string; text: string; timestamp: Date }>>([]);
  const [showChat, setShowChat] = useState(true);
  const [likeCount, setLikeCount] = useState(0);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        author: 'You',
        text: chatMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      onChatSend?.(chatMessage);
      setChatMessage('');
    }
  };

  const handleLike = () => {
    setLikeCount((prev) => prev + 1);
  };

  return (
    <div className={`flex flex-col lg:flex-row gap-4 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 ${className}`}>
      {/* Main Video Stream */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden group">
          {/* Stream Video Placeholder */}
          <div className="text-slate-400 text-6xl">📺</div>

          {/* Stream Info Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                  {hostName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{hostName}</p>
                  <p className="text-slate-300 text-xs">{category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-white text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            LIVE
          </div>

          {/* Viewer Count */}
          <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 bg-slate-900/60 backdrop-blur rounded-full text-white text-sm font-medium">
            <span>👥</span>
            <span>{viewerCount.toLocaleString()}</span>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className="absolute bottom-4 right-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition flex items-center gap-2"
          >
            <span>❤️</span>
            <span className="text-xs font-semibold">{likeCount}</span>
          </button>
        </div>

        {/* Stream Info */}
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
              {hostName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{hostName}</p>
              <p className="text-slate-400 text-xs">{category}</p>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold text-sm transition">
              Follow
            </button>
          </div>
        </div>

        {/* Pinned Product - Compact View */}
        {pinnedProduct && (
          <div className="p-4 bg-amber-900/10 border-b border-amber-700/30">
            <div className="flex items-center justify-between gap-4 p-3 bg-amber-950/40 rounded-lg border border-amber-700/30">
              <div className="flex-1">
                <p className="text-amber-200 text-xs font-medium mb-1">📌 Featured Product</p>
                <h3 className="text-white font-bold text-sm mb-1">{pinnedProduct.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold text-lg">
                    ${pinnedProduct.price.toFixed(2)}
                  </span>
                  {pinnedProduct.discount && (
                    <span className="px-2 py-1 bg-red-600/50 text-red-200 text-xs font-semibold rounded">
                      {pinnedProduct.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
              {pinnedProduct.quantity && pinnedProduct.quantity > 0 && (
                <button
                  onClick={onBuyClick}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition whitespace-nowrap"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Chat & Info */}
      <div className={`flex flex-col gap-4 ${showChat ? 'lg:w-80' : 'lg:w-64'} ${showChat ? 'h-screen lg:h-auto' : ''}`}>
        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden min-h-96">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-slate-700 bg-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Live Chat</h3>
            <button
              onClick={() => setShowChat(!showChat)}
              className="text-slate-400 hover:text-white transition"
            >
              {showChat ? '−' : '+'}
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {messages.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8">
                <p>👋 Be the first to chat!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="text-sm">
                  <p className="text-slate-300">
                    <span className="font-semibold text-white">{msg.author}:</span>{' '}
                    <span className="text-slate-300">{msg.text}</span>
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-700 bg-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Say something..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none placeholder-slate-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition font-semibold text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <h3 className="font-bold text-white text-sm mb-3">Stream Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Category</span>
              <span className="text-white font-medium">{category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Viewers</span>
              <span className="text-white font-medium">{viewerCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className="flex items-center gap-1 text-red-400 font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <h3 className="font-bold text-white text-sm mb-3">Share</h3>
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded text-xs font-semibold transition">
              Facebook
            </button>
            <button className="flex-1 py-2 px-3 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 rounded text-xs font-semibold transition">
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
