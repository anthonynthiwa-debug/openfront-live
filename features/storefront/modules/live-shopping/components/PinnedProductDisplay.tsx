'use client';

import { PinnedProductData } from '../hooks/useAgoraSignaling';

interface PinnedProductDisplayProps {
  product: PinnedProductData | null;
  isLoading?: boolean;
  onBuyClick?: () => void;
  className?: string;
}

/**
 * Component to display the pinned product during a live stream
 * Shows product details and calls-to-action for both viewers and broadcasters
 */
export function PinnedProductDisplay({
  product,
  isLoading = false,
  onBuyClick,
  className = '',
}: PinnedProductDisplayProps) {
  if (!product) {
    return null;
  }

  const discountedPrice = product.streamPrice
    ? product.streamPrice * (1 - (product.discount || 0) / 100)
    : undefined;

  return (
    <div
      className={`bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg p-4 ${className}`}
    >
      <div className="flex flex-col gap-3">
        {/* Header with pin icon */}
        <div className="flex items-start gap-2">
          <div className="text-amber-500 text-xl">📌</div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg">
              {product.productTitle}
            </h3>
            {product.variantTitle && (
              <p className="text-sm text-slate-300">{product.variantTitle}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-slate-300">{product.description}</p>
        )}

        {/* Price section */}
        {product.streamPrice && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              ${discountedPrice?.toFixed(2) || product.streamPrice.toFixed(2)}
            </span>
            {product.discount && product.discount > 0 && (
              <>
                <span className="text-sm text-slate-400 line-through">
                  ${product.streamPrice.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-emerald-400">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
        )}

        {/* Availability */}
        {product.quantity !== undefined && (
          <div className="text-sm text-slate-300">
            {product.quantity > 0 ? (
              <span className="text-emerald-400 font-medium">
                {product.quantity} available
              </span>
            ) : (
              <span className="text-red-400 font-medium">Out of stock</span>
            )}
          </div>
        )}

        {/* Buy button */}
        {onBuyClick && product.quantity && product.quantity > 0 && (
          <button
            onClick={onBuyClick}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <span>🛒</span>
                Buy Now
              </>
            )}
          </button>
        )}

        {/* Out of stock message */}
        {product.quantity === 0 && (
          <div className="w-full py-2 px-4 bg-slate-700 text-slate-300 font-semibold rounded-lg text-center">
            Out of stock
          </div>
        )}
      </div>
    </div>
  );
}
