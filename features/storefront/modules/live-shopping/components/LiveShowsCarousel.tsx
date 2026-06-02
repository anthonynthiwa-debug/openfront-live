'use client';

import React, { useState } from 'react';
import { LiveShowCard } from './LiveShowCard';

interface Show {
  id: string;
  title: string;
  host: string;
  avatarUrl?: string;
  thumbnail?: string;
  isLive: boolean;
  viewerCount?: number;
  scheduledTime?: string;
  category: string;
}

interface LiveShowsCarouselProps {
  shows: Show[];
  onShowSelect: (show: Show) => void;
  title?: string;
  subtitle?: string;
}

/**
 * Carousel component displaying multiple live shows
 * Horizontally scrollable with navigation arrows
 */
export function LiveShowsCarousel({
  shows,
  onShowSelect,
  title = 'Live & Upcoming Shows',
  subtitle = 'Watch live. Shop instantly.',
}: LiveShowsCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 400;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });

    setScrollPosition(newPosition);
  };

  const liveShows = shows.filter((show) => show.isLive);
  const upcomingShows = shows.filter((show) => !show.isLive);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-300 text-lg">{subtitle}</p>
        </div>

        {/* Live Shows Indicator */}
        {liveShows.length > 0 && (
          <div className="mb-4 inline-flex items-center gap-2 text-red-400 text-sm font-semibold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {liveShows.length} {liveShows.length === 1 ? 'Show' : 'Shows'} Now Streaming
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={scrollPosition === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 text-white disabled:opacity-30 transition"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {shows.map((show) => (
              <LiveShowCard
                key={show.id}
                title={show.title}
                host={show.host}
                avatarUrl={show.avatarUrl}
                thumbnail={show.thumbnail}
                isLive={show.isLive}
                viewerCount={show.viewerCount}
                scheduledTime={show.scheduledTime}
                category={show.category}
                onClick={() => onShowSelect(show)}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600 text-white transition"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Empty State */}
        {shows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg">No shows available right now</p>
            <p className="text-slate-500 text-sm mt-2">Check back soon for upcoming live shopping events</p>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Hide CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
