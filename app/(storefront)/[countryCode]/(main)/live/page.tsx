'use client';

import { useState } from 'react';

interface Props {
  params: {
    countryCode: string;
  };
}

export default function LiveShoppingPage({ params }: Props) {
  const [activeBroadcast, setActiveBroadcast] = useState<string | null>(null);

  // Mock live streams data
  const activeLiveStreams = [
    {
      id: 'stream-1',
      title: 'Summer Fashion Collection Live',
      merchant: 'StyleHub Fashion',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      viewers: 1234,
      status: 'live',
    },
    {
      id: 'stream-2',
      title: 'Tech Gadgets Unboxing',
      merchant: 'TechWorld Store',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      viewers: 856,
      status: 'live',
    },
    {
      id: 'stream-3',
      title: 'Beauty & Makeup Tutorial',
      merchant: 'Glow Beauty Pro',
      image: 'https://images.unsplash.com/photo-1596462502278-af3c41a801c1?w=400&h=300&fit=crop',
      viewers: 2341,
      status: 'live',
    },
    {
      id: 'stream-4',
      title: 'Home Decor Inspiration',
      merchant: 'Interior Masters',
      image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=300&fit=crop',
      viewers: 567,
      status: 'live',
    },
  ];

  const upcomingStreams = [
    {
      id: 'stream-5',
      title: 'Luxury Watch Collection',
      merchant: 'Premium Timepieces',
      image: 'https://images.unsplash.com/photo-1523170335684-f042f1d3aa7c?w=400&h=300&fit=crop',
      startTime: 'Today at 6 PM',
      status: 'scheduled',
    },
    {
      id: 'stream-6',
      title: 'Organic Skincare Launch',
      merchant: 'Natural Beauty Co',
      image: 'https://images.unsplash.com/photo-1596462502278-af3c41a3c4be?w=400&h=300&fit=crop',
      startTime: 'Tomorrow at 2 PM',
      status: 'scheduled',
    },
  ];

  if (activeBroadcast) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => setActiveBroadcast(null)}
            className="mb-6 inline-flex items-center gap-2 text-white hover:text-slate-300 font-medium transition"
          >
            <span>←</span> Back to Browse
          </button>

          <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="aspect-video bg-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-white font-semibold">Stream Viewer</p>
                <p className="text-slate-400 text-sm mt-2">Stream ID: {activeBroadcast}</p>
                <p className="text-slate-400 text-sm mt-1">Connect your Agora credentials to view live stream</p>
              </div>
            </div>
          </div>

          {/* Pinned Product Section */}
          <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-white font-bold mb-4">Featured Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-700 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-slate-400">📌 Product image</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-white text-lg font-bold mb-2">Premium Product</h3>
                <p className="text-slate-300 mb-4">Special live-only price and exclusive offer</p>
                <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-red-600 hover:to-pink-700 transition mb-3">
                  Buy Now
                </button>
                <p className="text-slate-400 text-sm">Available quantity: 25 units</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-pulse" />
                <div className="relative w-3 h-3 bg-red-500 rounded-full" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Live Shopping</h1>
                <p className="text-slate-300 mt-1">Watch merchants showcase products in real-time</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold rounded-full">
                {activeLiveStreams.length} STREAMING NOW
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Live Now Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Now Live</h2>
          <p className="text-slate-400 mb-8">Join these live shopping experiences</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeLiveStreams.map((stream) => (
              <div
                key={stream.id}
                onClick={() => setActiveBroadcast(stream.id)}
                className="group cursor-pointer"
              >
                <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-700 aspect-video">
                  <img
                    src={stream.image}
                    alt={stream.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                  {/* Live Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE
                  </div>

                  {/* Viewer Count */}
                  <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <span>👥</span>
                    {stream.viewers.toLocaleString()}
                  </div>
                </div>

                <h3 className="font-semibold text-white text-sm group-hover:text-pink-400 transition-colors line-clamp-2">
                  {stream.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{stream.merchant}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Section */}
        {upcomingStreams.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
            <p className="text-slate-400 mb-8">Don't miss these upcoming streams</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingStreams.map((stream) => (
                <div key={stream.id} className="group cursor-pointer">
                  <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-700 aspect-video">
                    <img
                      src={stream.image}
                      alt={stream.title}
                      className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">⏰</p>
                        <p className="text-white font-semibold mt-2">{stream.startTime}</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-white text-sm line-clamp-2">{stream.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{stream.merchant}</p>
                  <button className="mt-3 w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition">
                    Set Reminder
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Fashion', 'Tech', 'Beauty', 'Home', 'Sports', 'Food'].map((category) => (
              <button
                key={category}
                className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 hover:bg-slate-700 transition text-white font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-700">
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold text-white mb-2">Real-Time Interaction</h3>
            <p className="text-slate-400 text-sm">
              Chat with merchants and other shoppers while watching live
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-bold text-white mb-2">Exclusive Deals</h3>
            <p className="text-slate-400 text-sm">
              Get limited-time discounts only available during streams
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold text-white mb-2">Instant Checkout</h3>
            <p className="text-slate-400 text-sm">
              Buy featured products instantly without leaving the stream
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
