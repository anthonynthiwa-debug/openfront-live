'use client';

import { useState } from 'react';
import { LiveStreamBroadcaster, LiveStreamViewer } from '../components/LiveStreamViewer';
import { ProductSelectorWithPinning } from '../components/ProductSelectorWithPinning';
import { PinnedProductData } from '../hooks/useAgoraSignaling';

/**
 * Example page demonstrating the full product pinning feature
 * Shows both broadcaster and viewer experiences
 */
export function LiveShoppingPage() {
  const [activeTab, setActiveTab] = useState<'broadcaster' | 'viewer'>('broadcaster');
  const [broadcasting, setBroadcasting] = useState(false);
  const [pinnedProduct, setPinnedProduct] = useState<PinnedProductData | null>(null);
  const [sessionId] = useState('session-' + Date.now());
  const [channelName] = useState('live-stream-' + Date.now());

  // Mock Agora credentials (in production, fetch from your backend)
  const agoraAppId = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';
  const agoraToken = 'mock-token'; // In production, generate from your backend
  const broadcasterId = 1;
  const viewerId = 2;
  const broadcasterIdString = 'broadcaster-' + broadcasterId;
  const viewerIdString = 'viewer-' + viewerId;

  const handleBroadcastStart = () => {
    setBroadcasting(true);
    console.log('[v0] Broadcast started');
  };

  const handleBroadcastEnd = () => {
    setBroadcasting(false);
    setPinnedProduct(null);
    console.log('[v0] Broadcast ended');
  };

  const handleProductPin = (product: PinnedProductData) => {
    setPinnedProduct(product);
    console.log('[v0] Product pinned:', product);
  };

  const handleProductUnpin = () => {
    setPinnedProduct(null);
    console.log('[v0] Product unpinned');
  };

  const handleBuyClick = (product: PinnedProductData) => {
    console.log('[v0] Buy clicked for product:', product);
    // In production, navigate to checkout with this product
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Live Shopping - Product Pinning Demo</h1>
        <p className="text-slate-400 mt-1">
          Demonstrate real-time product pinning across broadcaster and viewer experiences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700 px-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('broadcaster')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'broadcaster'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            🎥 Broadcaster View
          </button>
          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === 'viewer'
                ? 'text-emerald-400 border-emerald-400'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            👁️ Viewer View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'broadcaster' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main broadcast area */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
                  <h2 className="text-lg font-semibold text-white">Broadcast Stream</h2>
                  <p className="text-sm text-slate-400">
                    Session ID: {sessionId} | Channel: {channelName}
                  </p>
                </div>
                <div className="p-4">
                  {agoraAppId ? (
                    <LiveStreamBroadcaster
                      sessionId={sessionId}
                      channelName={channelName}
                      userId={broadcasterId}
                      userIdString={broadcasterIdString}
                      agoraAppId={agoraAppId}
                      agoraToken={agoraToken}
                      onBroadcastStart={handleBroadcastStart}
                      onBroadcastEnd={handleBroadcastEnd}
                      className="h-96"
                    />
                  ) : (
                    <div className="h-96 flex items-center justify-center bg-slate-900 rounded">
                      <div className="text-center">
                        <p className="text-red-400 font-semibold mb-2">
                          ❌ Agora credentials not configured
                        </p>
                        <p className="text-slate-400 text-sm">
                          Set NEXT_PUBLIC_AGORA_APP_ID in your environment variables
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Broadcast status */}
              <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="text-xl font-bold text-white">
                      {broadcasting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                          Live Broadcasting
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
                          Not Broadcasting
                        </span>
                      )}
                    </p>
                  </div>
                  {pinnedProduct && (
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Pinned Product</p>
                      <p className="text-lg font-semibold text-amber-400">
                        📌 {pinnedProduct.productTitle}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right sidebar - Product selector */}
            <div>
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sticky top-6">
                <ProductSelectorWithPinning
                  sessionId={sessionId}
                  pinnedProduct={pinnedProduct}
                  onProductPin={handleProductPin}
                  onProductUnpin={handleProductUnpin}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'viewer' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main viewer area */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
                  <h2 className="text-lg font-semibold text-white">Live Stream View</h2>
                  <p className="text-sm text-slate-400">
                    Viewing: {channelName}
                  </p>
                </div>
                <div className="p-4">
                  {agoraAppId ? (
                    <LiveStreamViewer
                      sessionId={sessionId}
                      channelName={channelName}
                      userId={viewerId}
                      userIdString={viewerIdString}
                      agoraAppId={agoraAppId}
                      agoraToken={agoraToken}
                      onBuyClick={handleBuyClick}
                      className="h-96"
                    />
                  ) : (
                    <div className="h-96 flex items-center justify-center bg-slate-900 rounded">
                      <div className="text-center">
                        <p className="text-red-400 font-semibold mb-2">
                          ❌ Agora credentials not configured
                        </p>
                        <p className="text-slate-400 text-sm">
                          Set NEXT_PUBLIC_AGORA_APP_ID in your environment variables
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-white mb-2">📌 Product Pinning Feature</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>✓ Broadcaster can pin products during the stream</li>
                  <li>✓ Pinned product displays in real-time to viewers</li>
                  <li>✓ Viewers can purchase pinned products directly</li>
                  <li>✓ Pin state syncs across all connected clients</li>
                </ul>
              </div>
            </div>

            {/* Right sidebar - Product display */}
            <div>
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sticky top-6">
                <h3 className="text-lg font-semibold text-white mb-4">Available Products</h3>
                {pinnedProduct ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">{pinnedProduct.productTitle}</h4>
                      {pinnedProduct.variantTitle && (
                        <p className="text-sm text-slate-300 mb-3">{pinnedProduct.variantTitle}</p>
                      )}
                      <p className="text-2xl font-bold text-amber-400 mb-3">
                        ${pinnedProduct.streamPrice?.toFixed(2)}
                      </p>
                      {pinnedProduct.quantity && pinnedProduct.quantity > 0 && (
                        <button
                          onClick={() => handleBuyClick(pinnedProduct)}
                          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded transition"
                        >
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">
                    No product pinned yet. The broadcaster will pin a product to sell during the stream.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-8 mx-6 mb-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
        <h3 className="font-semibold text-blue-200 mb-2">ℹ️ About Product Pinning</h3>
        <p className="text-sm text-blue-100 mb-2">
          The Product Pinning feature allows merchants to highlight a specific product during their live stream.
          This product is displayed prominently to all viewers, who can then make purchases in real-time.
        </p>
        <p className="text-sm text-blue-100">
          <strong>How it works:</strong> Broadcaster selects a product from the product list → Product is pinned and
          broadcasts to all connected viewers via Agora signaling → Viewers see the pinned product with buy button →
          Purchases are tracked in real-time metrics.
        </p>
      </div>
    </div>
  );
}
