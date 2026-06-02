'use client';

import React from 'react';
import Image from 'next/image';

interface LiveShowCardProps {
  title: string;
  host: string;
  avatarUrl?: string;
  thumbnail?: string;
  isLive?: boolean;
  viewerCount?: number;
  scheduledTime?: string;
  category?: string;
  onClick?: () => void;
}

/**
 * Card component displaying a single live show
 * Inspired by TalkShop.Live design with live indicator and viewer count
 */
export function LiveShowCard({
  title,
  host,
  avatarUrl,
  thumbnail,
  isLive = false,
  viewerCount = 0,
  scheduledTime,
  category,
  onClick,
}: LiveShowCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-shrink-0 w-72 rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 text-left"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-64 bg-slate-800 overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <div className="text-slate-400 text-4xl">📺</div>
          </div>
        )}

        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-white text-xs font-bold animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            LIVE
          </div>
        )}

        {/* Scheduled Badge */}
        {!isLive && scheduledTime && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur rounded-full text-white text-xs font-medium">
            {scheduledTime}
          </div>
        )}

        {/* Viewer Count Badge */}
        {isLive && viewerCount > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-slate-900/60 backdrop-blur rounded-full text-white text-xs">
            <span>👥</span>
            <span>{viewerCount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        {/* Category Badge */}
        {category && (
          <div className="mb-2 inline-block px-2 py-1 bg-slate-700 rounded text-white text-xs font-medium">
            {category}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-3 group-hover:text-red-400 transition">
          {title}
        </h3>

        {/* Host Info */}
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={host}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-slate-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              {host.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-white text-xs font-medium">{host}</p>
            {isLive && <p className="text-red-400 text-xs font-semibold">Now Showing</p>}
          </div>
        </div>

        {/* Watch Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
        >
          {isLive ? 'Watch Live' : 'Notify Me'}
        </button>
      </div>
    </button>
  );
}
