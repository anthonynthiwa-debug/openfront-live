'use client';

import React, { useState } from 'react';
import { LiveShowsCarousel } from '../components/LiveShowsCarousel';
import { BroadcasterControlPanel } from '../components/BroadcasterControlPanel';

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

/**
 * Main landing page for live shopping platform
 * Displays live shows carousel, featured streams, and browse options
 * Inspired by TalkShop.Live design
 */
export function LiveShoppingLandingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);

  // Mock live shows data
  const mockShows: Show[] = [
    {
      id: '1',
      title: 'Exclusive Music Collection Launch',
      host: 'Ziggy Marley',
      category: 'Music',
      isLive: true,
      viewerCount: 2547,
      thumbnail: undefined,
    },
    {
      id: '2',
      title: 'Best Of Night Ranger - CD Signed',
      host: 'Redd Kross',
      category: 'Music',
      isLive: true,
      viewerCount: 1823,
      thumbnail: undefined,
    },
    {
      id: '3',
      title: 'Autographed Books & Collectibles',
      host: 'Stephen King',
      category: 'Books',
      isLive: false,
      scheduledTime: 'Jun 24th at 12:00am',
      thumbnail: undefined,
    },
    {
      id: '4',
      title: 'Beauty & Skincare Launch',
      host: 'Beauty Expert Ella',
      category: 'Beauty',
      isLive: true,
      viewerCount: 3102,
      thumbnail: undefined,
    },
    {
      id: '5',
      title: 'Electronics & Tech Gadgets',
      host: 'Tech Guru Alex',
      category: 'Electronics',
      isLive: false,
      scheduledTime: 'Jul 8th at 3:00pm',
      thumbnail: undefined,
    },
    {
      id: '6',
      title: 'Fashion Forward with Designers',
      host: 'Designer Collections',
      category: 'Fashion',
      isLive: true,
      viewerCount: 1654,
      thumbnail: undefined,
    },
  ];

  const categories = [
    { id: 'all', label: '🌟 All', count: mockShows.length },
    { id: 'books', label: '📚 Books', count: mockShows.filter((s) => s.category.toLowerCase() === 'books').length },
    { id: 'music', label: '🎵 Music', count: mockShows.filter((s) => s.category.toLowerCase() === 'music').length },
    { id: 'beauty', label: '💄 Beauty', count: mockShows.filter((s) => s.category.toLowerCase() === 'beauty').length },
    { id: 'electronics', label: '📱 Electronics', count: mockShows.filter((s) => s.category.toLowerCase() === 'electronics').length },
    { id: 'fashion', label: '👗 Fashion', count: mockShows.filter((s) => s.category.toLowerCase() === 'fashion').length },
  ];

  const filteredShows =
    selectedCategory === 'all'
      ? mockShows
      : mockShows.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const liveCount = mockShows.filter((s) => s.isLive).length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                🛍️
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LiveShop</h1>
                <p className="text-xs text-red-400">Watch. Shop. Save.</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button className="text-slate-300 hover:text-white transition">
                Browse
              </button>
              <button className="text-slate-300 hover:text-white transition">
                My Favorites
              </button>
              <button className="text-slate-300 hover:text-white transition">
                Help
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-slate-300 hover:text-white transition text-sm font-medium">
                Sign In
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition">
                Start Streaming
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Live Indicator */}
      {liveCount > 0 && (
        <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-b border-red-600/30 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-red-300 font-medium">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              {liveCount} {liveCount === 1 ? 'stream' : 'streams'} now live!
            </p>
          </div>
        </div>
      )}

      {/* Hero Section - Live Shows Carousel */}
      <LiveShowsCarousel
        shows={mockShows}
        onShowSelect={(show) => setSelectedShow(show)}
        title="Live & Upcoming Shows"
        subtitle="Watch live. Shop instantly."
      />

      {/* Category Navigation */}
      <section className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
            Browse Categories
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {category.label}
                {category.count > 0 && (
                  <span className="ml-2 text-sm opacity-75">({category.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shows Grid */}
      <section className="bg-slate-900 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {selectedCategory === 'all' ? 'Featured Shows' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Shows`}
            </h2>
            <p className="text-slate-400">
              {filteredShows.length} {filteredShows.length === 1 ? 'show' : 'shows'} available
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-800">
            <button className="px-4 py-3 font-semibold text-white border-b-2 border-red-600 text-sm">
              Now Streaming
            </button>
            <button className="px-4 py-3 font-semibold text-slate-400 hover:text-white text-sm transition">
              Coming Up
            </button>
            <button className="px-4 py-3 font-semibold text-slate-400 hover:text-white text-sm transition">
              Popular
            </button>
          </div>

          {/* Shows Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShows.map((show) => (
              <div
                key={show.id}
                onClick={() => setSelectedShow(show)}
                className="group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative mb-4 rounded-xl overflow-hidden bg-slate-800 aspect-video border border-slate-700 group-hover:border-red-600 transition">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center group-hover:from-slate-600">
                    <div className="text-6xl">📺</div>
                  </div>

                  {/* Badges */}
                  {show.isLive && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 bg-red-600 rounded-full text-white text-xs font-bold animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      LIVE
                    </div>
                  )}

                  {show.viewerCount && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-slate-900/60 backdrop-blur rounded-full text-white text-xs">
                      👥 {show.viewerCount.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition">
                  {show.title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                    {show.host.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{show.host}</p>
                    <p className="text-slate-400 text-xs">{show.category}</p>
                  </div>
                </div>

                <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 text-sm">
                  {show.isLive ? 'Watch Now' : 'Notify Me'}
                </button>
              </div>
            ))}
          </div>

          {filteredShows.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg mb-2">No shows in this category</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-red-400 hover:text-red-300 text-sm font-semibold"
              >
                View all shows
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-red-600/30 to-pink-600/30 border-y border-red-600/30 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Own Stream?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators selling live. Launch your first broadcast today and connect with customers in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition">
              Become a Broadcaster
            </button>
            <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition border border-slate-700">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Browse Shows</a></li>
                <li><a href="#" className="hover:text-white transition">Start Streaming</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-slate-500">
              © 2024 LiveShop. All rights reserved. Watch live. Shop instantly.
            </p>
          </div>
        </div>
      </footer>

      {/* Selected Show Modal */}
      {selectedShow && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full border border-slate-700 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">{selectedShow.title}</h2>
              <button
                onClick={() => setSelectedShow(null)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-lg font-bold">
                    {selectedShow.host.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{selectedShow.host}</p>
                    <p className="text-slate-400 text-sm">{selectedShow.category}</p>
                  </div>
                  {selectedShow.isLive && (
                    <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full text-white text-xs font-bold">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      LIVE
                    </div>
                  )}
                </div>

                {selectedShow.viewerCount && (
                  <p className="text-slate-300 text-sm">
                    👥 {selectedShow.viewerCount.toLocaleString()} watching right now
                  </p>
                )}

                {selectedShow.scheduledTime && (
                  <p className="text-slate-300 text-sm">
                    📅 Scheduled for {selectedShow.scheduledTime}
                  </p>
                )}
              </div>

              <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition">
                {selectedShow.isLive ? 'Join Stream Now' : 'Set Reminder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
