'use client';

import React, { useState } from 'react';

interface BroadcasterMetrics {
  viewerCount: number;
  purchaseCount: number;
  revenue: number;
}

interface BroadcasterControlPanelProps {
  isLive: boolean;
  onStartBroadcast: () => void;
  onStopBroadcast: () => void;
  metrics?: BroadcasterMetrics;
  pinnedProductTitle?: string;
  onUnpinProduct?: () => void;
  streamUrl?: string;
  category?: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

/**
 * Control panel for broadcasters showing metrics and stream status
 * Includes start/stop controls and real-time analytics
 */
export function BroadcasterControlPanel({
  isLive,
  onStartBroadcast,
  onStopBroadcast,
  metrics,
  pinnedProductTitle,
  onUnpinProduct,
  streamUrl,
  category,
  onCategoryChange,
  className = '',
}: BroadcasterControlPanelProps) {
  const [copied, setCopied] = useState(false);

  const copyStreamUrl = () => {
    if (streamUrl) {
      navigator.clipboard.writeText(streamUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 border-b border-slate-700">
        <h3 className="text-xl font-bold text-white mb-1">🎬 Broadcaster Control Panel</h3>
        <p className="text-sm text-slate-400">Manage your live stream</p>
      </div>

      {/* Status Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Stream Status</p>
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}
              ></div>
              <span
                className={`text-lg font-bold ${isLive ? 'text-red-400' : 'text-slate-400'}`}
              >
                {isLive ? 'LIVE NOW' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2">
            {!isLive ? (
              <button
                onClick={onStartBroadcast}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition duration-200 flex items-center gap-2"
              >
                <span>▶</span> Start Broadcast
              </button>
            ) : (
              <button
                onClick={onStopBroadcast}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-200 flex items-center gap-2"
              >
                <span>⏹</span> Stop Broadcast
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stream URL */}
      {streamUrl && (
        <div className="p-6 border-b border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Share Stream Link</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={streamUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-300 text-sm"
            />
            <button
              onClick={copyStreamUrl}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Metrics Section */}
      {metrics && (
        <div className="p-6 border-b border-slate-700">
          <p className="text-sm text-slate-400 mb-4 font-semibold">Real-Time Metrics</p>
          <div className="grid grid-cols-3 gap-4">
            {/* Viewers */}
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-xs font-medium mb-1">Viewers</p>
              <p className="text-2xl font-bold text-blue-400">
                {metrics.viewerCount.toLocaleString()}
              </p>
            </div>

            {/* Purchases */}
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-xs font-medium mb-1">Purchases</p>
              <p className="text-2xl font-bold text-green-400">
                {metrics.purchaseCount}
              </p>
            </div>

            {/* Revenue */}
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-xs font-medium mb-1">Revenue</p>
              <p className="text-2xl font-bold text-emerald-400">
                ${metrics.revenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pinned Product Section */}
      {pinnedProductTitle && (
        <div className="p-6 border-b border-slate-700 bg-amber-900/10 border-t border-amber-700/30">
          <p className="text-sm text-slate-400 mb-2 font-semibold">Pinned Product</p>
          <div className="flex items-center justify-between gap-4 p-3 bg-amber-950/40 rounded-lg border border-amber-700/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📌</span>
              <div>
                <p className="text-white font-semibold text-sm">{pinnedProductTitle}</p>
                <p className="text-amber-200/70 text-xs">Featured product</p>
              </div>
            </div>
            {onUnpinProduct && (
              <button
                onClick={onUnpinProduct}
                className="px-3 py-1 bg-amber-600/50 hover:bg-amber-600 text-amber-100 text-sm rounded transition"
              >
                Unpin
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category Section */}
      {onCategoryChange && (
        <div className="p-6 border-b border-slate-700">
          <p className="text-sm text-slate-400 mb-2 font-semibold">Stream Category</p>
          <select
            value={category || 'books'}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-600 text-white rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
          >
            <option value="books">📚 Books</option>
            <option value="music">🎵 Music</option>
            <option value="electronics">📱 Electronics</option>
            <option value="beauty">💄 Beauty</option>
            <option value="fashion">👗 Fashion</option>
            <option value="other">🎭 Other</option>
          </select>
        </div>
      )}

      {/* Info Footer */}
      <div className="p-4 bg-slate-900/50">
        <p className="text-xs text-slate-500 text-center">
          💡 Tip: Pin products to boost engagement and drive sales during your stream
        </p>
      </div>
    </div>
  );
}
