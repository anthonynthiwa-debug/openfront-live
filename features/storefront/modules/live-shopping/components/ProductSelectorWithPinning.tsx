'use client';

import { useState, useEffect, useCallback } from 'react';
import { StreamProduct } from '../types';
import { PinnedProductData } from '../hooks/useAgoraSignaling';

interface ProductSelectorWithPinningProps {
  sessionId: string;
  pinnedProduct: PinnedProductData | null;
  onProductPin?: (product: PinnedProductData) => void;
  onProductUnpin?: () => void;
  className?: string;
}

/**
 * Enhanced product selector with pinning capability for merchants
 * Allows selecting which product to feature/pin during a live stream
 */
export function ProductSelectorWithPinning({
  sessionId,
  pinnedProduct,
  onProductPin,
  onProductUnpin,
  className = '',
}: ProductSelectorWithPinningProps) {
  const [products, setProducts] = useState<StreamProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pinning, setPinning] = useState(false);

  // Fetch stream products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stream-products?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch products');
      setError(error.message);
      console.error('[v0] Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchProducts();
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchProducts, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionId, fetchProducts]);

  const handlePinProduct = async (product: StreamProduct) => {
    try {
      setPinning(true);

      // Pin product via API
      const response = await fetch('/api/stream-products/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId: product.id,
          variantId: product.variant?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to pin product');
      }

      const data = await response.json();

      // Prepare pinned product data
      const pinnedData: PinnedProductData = {
        productId: product.product.id,
        productTitle: product.product.title,
        variantId: product.variant?.id,
        variantTitle: product.variant?.title,
        streamPrice: product.streamPrice || 0,
        discount: product.discount,
        quantity: product.quantity - product.quantitySold,
        description: product.product.description,
        timestamp: Date.now(),
      };

      onProductPin?.(pinnedData);
      console.log('[v0] Product pinned:', product.product.title);
    } catch (err) {
      console.error('[v0] Error pinning product:', err);
    } finally {
      setPinning(false);
    }
  };

  const handleUnpinProduct = async () => {
    try {
      setPinning(true);

      const response = await fetch('/api/stream-products/pin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to unpin product');
      }

      onProductUnpin?.();
      console.log('[v0] Product unpinned');
    } catch (err) {
      console.error('[v0] Error unpinning product:', err);
    } finally {
      setPinning(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className={`p-4 text-slate-400 ${className}`}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 text-red-500 ${className}`}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          📌 Pin Product to Stream
        </h3>
        <p className="text-sm text-slate-400 mb-3">
          {pinnedProduct
            ? `Currently pinned: ${pinnedProduct.productTitle}`
            : 'Select a product to feature during your stream'}
        </p>
      </div>

      {pinnedProduct && (
        <div className="flex items-center justify-between p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-amber-200">{pinnedProduct.productTitle}</h4>
            {pinnedProduct.variantTitle && (
              <p className="text-xs text-amber-300">{pinnedProduct.variantTitle}</p>
            )}
            <p className="text-xs text-amber-400 mt-1">
              Available: {pinnedProduct.quantity} • Price: ${pinnedProduct.streamPrice?.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleUnpinProduct}
            disabled={pinning}
            className="ml-4 px-3 py-1 text-sm bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded transition"
          >
            {pinning ? 'Unpinning...' : 'Unpin'}
          </button>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-slate-200 mb-2">Available Products</h4>
        {products.length === 0 ? (
          <p className="text-slate-400 text-sm">No products available</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
            {products.map((product) => {
              const isPinned = pinnedProduct?.productId === product.product.id;
              const availableQty = product.quantity - product.quantitySold;

              return (
                <div
                  key={product.id}
                  className={`flex items-center justify-between p-3 rounded border transition ${
                    isPinned
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{product.product.title}</h4>
                    {product.variant && (
                      <p className="text-xs text-slate-400">{product.variant.title}</p>
                    )}
                    <div className="flex gap-3 mt-1 text-xs text-slate-400">
                      <span>Price: ${product.streamPrice?.toFixed(2) || 'N/A'}</span>
                      <span>Available: {availableQty}</span>
                      <span>Views: {product.impressions}</span>
                      <span>Sales: {product.purchases}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePinProduct(product)}
                    disabled={pinning || availableQty <= 0}
                    className={`ml-4 px-3 py-2 text-sm font-medium rounded transition ${
                      isPinned
                        ? 'bg-amber-600 text-white'
                        : availableQty <= 0
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isPinned ? '📌 Pinned' : availableQty <= 0 ? 'Out of stock' : 'Pin'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
