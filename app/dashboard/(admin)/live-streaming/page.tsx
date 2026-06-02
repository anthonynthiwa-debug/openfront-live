'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BroadcasterControlPanel } from '@/features/storefront/modules/live-shopping/components/BroadcasterControlPanel';
import { ProductSelectorWithPinning } from '@/features/storefront/modules/live-shopping/components/ProductSelectorWithPinning';
import { useAgoraSignaling } from '@/features/storefront/modules/live-shopping/hooks/useAgoraSignaling';

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';

export default function LiveStreamingPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [channelName, setChannelName] = useState<string>('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [stats, setStats] = useState({
    viewers: 0,
    purchases: 0,
    revenue: 0,
    engagement: 0,
  });

  const { connected: signalingConnected, pinnedProduct } = useAgoraSignaling({
    channelName,
    userId: 'merchant-001',
    agoraAppId: AGORA_APP_ID,
    agoraToken: '',
    role: 'publisher',
  });

  // Mock products
  const availableProducts = [
    {
      id: '1',
      title: 'Premium Wireless Headphones',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      stock: 12,
    },
    {
      id: '2',
      title: 'Smart Watch Pro',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      stock: 8,
    },
    {
      id: '3',
      title: 'Designer Sunglasses',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop',
      stock: 15,
    },
    {
      id: '4',
      title: 'Premium Camera',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&h=200&fit=crop',
      stock: 5,
    },
  ];

  const startBroadcast = () => {
    if (!streamTitle) {
      alert('Please enter a stream title');
      return;
    }

    const newSessionId = `session-${Date.now()}`;
    const newChannelName = `stream-${Date.now()}`;

    setSessionId(newSessionId);
    setChannelName(newChannelName);
    setBroadcasting(true);

    // Simulate viewer updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        viewers: Math.floor(Math.random() * 500) + 50,
        purchases: Math.floor(Math.random() * 20),
        revenue: Math.floor(Math.random() * 5000),
        engagement: Math.floor(Math.random() * 100),
      }));
    }, 3000);

    return () => clearInterval(interval);
  };

  const stopBroadcast = () => {
    setBroadcasting(false);
    setSessionId('');
    setChannelName('');
    setStreamTitle('');
    setStreamDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Live Streaming Dashboard</h1>
          <p className="text-slate-600 mt-2">Broadcast products in real-time and manage sales</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Broadcast Area */}
          <div className="lg:col-span-2 space-y-6">
            {!broadcasting ? (
              <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Start a Live Stream</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stream Title *
                    </label>
                    <input
                      type="text"
                      value={streamTitle}
                      onChange={(e) => setStreamTitle(e.target.value)}
                      placeholder="e.g., Summer Collection Launch"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={streamDescription}
                      onChange={(e) => setStreamDescription(e.target.value)}
                      placeholder="Tell viewers what you'll be showcasing..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={startBroadcast}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-600 transition-all shadow-lg"
                  >
                    Start Broadcasting
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Live Broadcast View */}
                <div className="bg-black rounded-lg shadow-lg overflow-hidden aspect-video">
                  <BroadcasterControlPanel
                    sessionId={sessionId}
                    channelName={channelName}
                    userId={1}
                    userIdString="merchant-001"
                    agoraAppId={AGORA_APP_ID}
                    agoraToken={process.env.NEXT_PUBLIC_AGORA_TOKEN || ''}
                    onError={(error) => console.error('Broadcast error:', error)}
                    onBroadcastStart={() => console.log('Broadcast started')}
                    onBroadcastEnd={stopBroadcast}
                    className="w-full h-full"
                  />
                </div>

                {/* Stream Info */}
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="font-bold text-slate-900 mb-2">{streamTitle}</h3>
                  <p className="text-slate-600 text-sm">{streamDescription}</p>
                </div>

                {/* Stop Button */}
                <button
                  onClick={stopBroadcast}
                  className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
                >
                  Stop Broadcasting
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Stats & Product Selector */}
          <div className="space-y-6">
            {/* Live Stats */}
            {broadcasting && (
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Live Statistics</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Viewers
                    </span>
                    <span className="text-2xl font-bold text-slate-900">{stats.viewers}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Sales</span>
                    <span className="text-2xl font-bold text-green-600">{stats.purchases}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Revenue</span>
                    <span className="text-2xl font-bold text-slate-900">${stats.revenue}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Engagement</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.engagement}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Product Selector */}
            {broadcasting && (
              <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Pin a Product</h3>
                <ProductSelectorWithPinning
                  sessionId={sessionId}
                  products={availableProducts}
                  pinnedProductId={pinnedProduct?.payload?.productId}
                  onProductPin={(product) => {
                    console.log('Pinned product:', product);
                  }}
                  onProductUnpin={() => {
                    console.log('Unpinned product');
                  }}
                />
              </div>
            )}

            {/* Product Catalog */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Your Products</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                      pinnedProduct?.payload?.productId === product.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">{product.title}</p>
                        <p className="text-red-600 font-bold text-sm">${product.price}</p>
                        <p className="text-xs text-slate-500">{product.stock} in stock</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
