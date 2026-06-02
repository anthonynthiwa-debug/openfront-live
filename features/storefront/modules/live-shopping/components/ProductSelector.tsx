'use client';

import { useState, useEffect, useCallback } from 'react';
import { StreamProduct } from '../types';

interface ProductSelectorProps {
  sessionId: string;
  onProductSelected?: (product: StreamProduct) => void;
  onProductRemoved?: (productId: string) => void;
  className?: string;
}

/**
 * Component for merchants to select and manage products during broadcast
 */
export function ProductSelector({
  sessionId,
  onProductSelected,
  onProductRemoved,
  className = '',
}: ProductSelectorProps) {
  const [products, setProducts] = useState<StreamProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleRemoveProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/stream-products?productId=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove product');
      }

      onProductRemoved?.(productId);
      fetchProducts();
    } catch (err) {
      console.error('[v0] Error removing product:', err);
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
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-100">Featured Products</h3>
      {products.length === 0 ? (
        <p className="text-slate-400">No products featured yet</p>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700"
            >
              <div className="flex-1">
                <h4 className="font-medium text-white">{product.product.title}</h4>
                <div className="flex gap-4 mt-1 text-sm text-slate-400">
                  <span>Qty: {product.quantitySold}/{product.quantity}</span>
                  <span>Views: {product.impressions}</span>
                  <span>Sales: {product.purchases}</span>
                </div>
              </div>
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="ml-4 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
