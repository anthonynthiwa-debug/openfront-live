'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveShowsCarousel } from '@/features/storefront/modules/live-shopping/components/LiveShowsCarousel';
import { LiveStreamEnhancedViewer } from '@/features/storefront/modules/live-shopping/components/LiveStreamEnhancedViewer';

interface Props {
  params: {
    countryCode: string;
  };
}

export default function LiveShoppingPage({ params }: Props) {
  const [activeBroadcast, setActiveBroadcast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading active broadcasts
    setIsLoading(false);
  }, []);

  // Mock live streams data
  const activeLiveStreams = [
    {
      id: 'stream-1',
      title: 'Summer Fashion Collection Live',
      merchant: 'StyleHub Fashion',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      viewers: 1234,
      channelName: 'fashion-live-001',
      userId: 1,
      userIdString: 'merchant-1',
    },
    {
      id: 'stream-2',
      title: 'Tech Gadgets Unboxing',
      merchant: 'TechWorld Store',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      viewers: 856,
      channelName: 'tech-live-002',
      userId: 2,
      userIdString: 'merchant-2',
    },
    {
      id: 'stream-3',
      title: 'Beauty & Makeup Tutorial',
      merchant: 'Glow Beauty Pro',
      image: 'https://images.unsplash.com/photo-1596462502278-af3c41a801c1?w=400&h=300&fit=crop',
      viewers: 2341,
      channelName: 'beauty-live-003',
      userId: 3,
      userIdString: 'merchant-3',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse" />
              <div className="relative w-3 h-3 bg-red-600 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Live Shopping</h1>
            <span className="ml-auto inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              LIVE NOW
            </span>
          </div>
          <p className="text-slate-600 mt-2">
            Watch merchants showcase products in real-time and shop instantly
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeBroadcast ? (
          // Stream Detail View
          <div className="space-y-6">
            <button
              onClick={() => setActiveBroadcast(null)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              <span>←</span> Back to Browse
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <LiveStreamEnhancedViewer
                sessionId={activeBroadcast}
                channelName={`stream-${activeBroadcast}`}
                userId={Math.floor(Math.random() * 1000000)}
                userIdString={`viewer-${Date.now()}`}
                agoraAppId={process.env.NEXT_PUBLIC_AGORA_APP_ID || ''}
                agoraToken={process.env.NEXT_PUBLIC_AGORA_TOKEN || ''}
                onBuyClick={(product) => {
                  console.log('Buying product:', product);
                  // Handle checkout flow
                }}
              />
            </div>
          </div>
        ) : (
          // Browse Live Streams
          <Tabs defaultValue="now" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="now">Streaming Now</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="now" className="space-y-6">
              <div className="grid gap-4">
                <h2 className="text-xl font-bold text-slate-900">Currently Live</h2>
                <LiveShowsCarousel
                  streams={activeLiveStreams}
                  onStreamSelect={(streamId) => setActiveBroadcast(streamId)}
                />
              </div>

              {/* Featured Section */}
              <div className="mt-12 space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Featured Streams</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeLiveStreams.map((stream) => (
                    <div
                      key={stream.id}
                      onClick={() => setActiveBroadcast(stream.id)}
                      className="group cursor-pointer rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition-all"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={stream.image}
                          alt={stream.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          LIVE
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded">
                          {stream.viewers.toLocaleString()} watching
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 line-clamp-2">{stream.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{stream.merchant}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <div className="text-center py-12">
                <p className="text-slate-600">No upcoming streams scheduled</p>
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Fashion', 'Tech', 'Beauty', 'Home', 'Sports', 'Food', 'Jewelry', 'Electronics'].map(
                  (category) => (
                    <button
                      key={category}
                      className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-400 transition text-slate-700 font-medium"
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
