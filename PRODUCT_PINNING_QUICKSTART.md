# Product Pinning - Quick Start Guide

## 5-Minute Setup

### 1. Environment Setup
Add to `.env.local`:
```bash
NEXT_PUBLIC_AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
```

### 2. Import Components
```typescript
import { LiveStreamBroadcaster, LiveStreamViewer } from '@/features/storefront/modules/live-shopping/components/LiveStreamViewer';
import { ProductSelectorWithPinning } from '@/features/storefront/modules/live-shopping/components/ProductSelectorWithPinning';
import { useAgoraSignaling } from '@/features/storefront/modules/live-shopping/hooks/useAgoraSignaling';
```

### 3. Broadcaster Page
```typescript
import { ProductSelectorWithPinning } from '@/features/storefront/modules/live-shopping/components/ProductSelectorWithPinning';
import { useAgoraSignaling } from '@/features/storefront/modules/live-shopping/hooks/useAgoraSignaling';

export default function BroadcasterPage() {
  const [sessionId] = useState('session-' + Date.now());
  const [channelName] = useState('live-' + Date.now());
  const [pinnedProduct, setPinnedProduct] = useState(null);

  const { broadcastPinnedProduct, clearPinnedProduct } = useAgoraSignaling({
    channelName,
    userId: 'broadcaster-' + userId,
    agoraAppId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    agoraToken: agoraToken, // Get from backend
    role: 'publisher',
  });

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <LiveStreamBroadcaster
          sessionId={sessionId}
          channelName={channelName}
          userId={broadcasterId}
          userIdString={'broadcaster-' + broadcasterId}
          agoraAppId={process.env.NEXT_PUBLIC_AGORA_APP_ID}
          agoraToken={agoraToken}
          className="h-96"
        />
      </div>
      <div>
        <ProductSelectorWithPinning
          sessionId={sessionId}
          pinnedProduct={pinnedProduct}
          onProductPin={(product) => {
            broadcastPinnedProduct(product);
            setPinnedProduct(product);
          }}
          onProductUnpin={() => {
            clearPinnedProduct();
            setPinnedProduct(null);
          }}
        />
      </div>
    </div>
  );
}
```

### 4. Viewer Page
```typescript
import { LiveStreamViewer } from '@/features/storefront/modules/live-shopping/components/LiveStreamViewer';

export default function ViewerPage() {
  const [sessionId] = useState('session-123');
  const [channelName] = useState('live-123');

  return (
    <LiveStreamViewer
      sessionId={sessionId}
      channelName={channelName}
      userId={viewerId}
      userIdString={'viewer-' + viewerId}
      agoraAppId={process.env.NEXT_PUBLIC_AGORA_APP_ID}
      agoraToken={agoraToken} // Get from backend
      onBuyClick={(product) => {
        // Navigate to checkout
        navigateToCheckout(product);
      }}
      className="h-96"
    />
  );
}
```

## Feature Overview

| Feature | Broadcaster | Viewer |
|---------|------------|--------|
| Start/Stop Stream | ✅ | - |
| View Stream | ✅ | ✅ |
| Select Product | ✅ | - |
| Pin Product | ✅ | - |
| See Pinned Product | ✅ (indicator) | ✅ (card) |
| Buy Product | ✅ | ✅ |

## API Endpoints

### Pin Product
```bash
POST /api/stream-products/pin
{
  "sessionId": "session-123",
  "productId": "prod-456",
  "variantId": "var-789"
}
```

### Unpin Product
```bash
DELETE /api/stream-products/pin
{
  "sessionId": "session-123"
}
```

### Get Pinned Product
```bash
GET /api/stream-products/pin?sessionId=session-123
```

## Component Props

### LiveStreamBroadcaster
```typescript
interface LiveStreamBroadcasterProps {
  sessionId: string;              // Unique session ID
  channelName: string;            // Agora channel name
  userId: number;                 // Numeric user ID
  userIdString: string;           // String user ID for RTM
  agoraAppId: string;             // Agora App ID
  agoraToken: string;             // Agora token
  onError?: (error: Error) => void;
  onBroadcastStart?: () => void;
  onBroadcastEnd?: () => void;
  className?: string;
}
```

### LiveStreamViewer
```typescript
interface LiveStreamViewerProps {
  sessionId: string;              // Same session ID as broadcaster
  channelName: string;            // Same channel name
  userId: number;                 // Unique viewer ID
  userIdString: string;           // String user ID for RTM
  agoraAppId: string;             // Agora App ID
  agoraToken: string;             // Agora token
  onError?: (error: Error) => void;
  onBuyClick?: (product: PinnedProductData) => void;
  className?: string;
}
```

### ProductSelectorWithPinning
```typescript
interface ProductSelectorWithPinningProps {
  sessionId: string;                           // Unique session ID
  pinnedProduct: PinnedProductData | null;     // Current pinned product
  onProductPin?: (product: PinnedProductData) => void;
  onProductUnpin?: () => void;
  className?: string;
}
```

### useAgoraSignaling Hook
```typescript
const {
  connected,                      // RTM connection status
  pinnedProduct,                  // Current pinned product
  broadcastPinnedProduct,         // Function to pin product
  clearPinnedProduct,             // Function to unpin
  onPinnedProductReceived,        // Register callback
} = useAgoraSignaling({
  channelName: 'live-stream-id',
  userId: 'user-id',
  agoraAppId: 'your-app-id',
  agoraToken: 'your-token',
  role: 'publisher' | 'subscriber'
});
```

## Example: Complete Integration

```typescript
'use client';

import { useState } from 'react';
import { LiveStreamBroadcaster, LiveStreamViewer } from '@/features/storefront/modules/live-shopping/components/LiveStreamViewer';
import { ProductSelectorWithPinning } from '@/features/storefront/modules/live-shopping/components/ProductSelectorWithPinning';
import type { PinnedProductData } from '@/features/storefront/modules/live-shopping/hooks/useAgoraSignaling';

export default function LiveShoppingDemo() {
  const [mode, setMode] = useState<'broadcaster' | 'viewer'>('broadcaster');
  const [pinnedProduct, setPinnedProduct] = useState<PinnedProductData | null>(null);
  
  const sessionId = 'session-demo';
  const channelName = 'live-demo';

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setMode('broadcaster')}
          className={`px-4 py-2 rounded ${mode === 'broadcaster' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
        >
          Broadcaster
        </button>
        <button
          onClick={() => setMode('viewer')}
          className={`px-4 py-2 rounded ${mode === 'viewer' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
        >
          Viewer
        </button>
      </div>

      {mode === 'broadcaster' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <LiveStreamBroadcaster
              sessionId={sessionId}
              channelName={channelName}
              userId={1}
              userIdString="broadcaster-1"
              agoraAppId={process.env.NEXT_PUBLIC_AGORA_APP_ID!}
              agoraToken="your-token"
              className="h-96"
            />
          </div>
          <ProductSelectorWithPinning
            sessionId={sessionId}
            pinnedProduct={pinnedProduct}
            onProductPin={setPinnedProduct}
            onProductUnpin={() => setPinnedProduct(null)}
          />
        </div>
      )}

      {mode === 'viewer' && (
        <LiveStreamViewer
          sessionId={sessionId}
          channelName={channelName}
          userId={2}
          userIdString="viewer-2"
          agoraAppId={process.env.NEXT_PUBLIC_AGORA_APP_ID!}
          agoraToken="your-token"
          className="h-96"
        />
      )}
    </div>
  );
}
```

## Testing Checklist

- [ ] Environment variables set
- [ ] Agora credentials valid
- [ ] Broadcaster can start stream
- [ ] Viewer can see broadcaster
- [ ] Broadcaster can pin product
- [ ] Viewer sees pinned product in real-time
- [ ] Product unpins correctly
- [ ] Buy button works
- [ ] Mobile layout responsive

## Common Issues

### RTM Not Connected
```typescript
// Check RTM connection
if (!connected) {
  console.warn('RTM not connected yet');
}
```

### Product Not Appearing
- Verify `sessionId` and `channelName` match
- Check RTM is connected
- Verify product has quantity > 0

### Delayed Updates
- Check network latency
- Verify Agora channel status
- Check for browser network throttling

## Next Steps

1. ✅ Implement in your pages
2. ✅ Test with multiple browsers
3. ✅ Add error boundaries
4. ✅ Customize styling
5. ✅ Add analytics tracking
6. ✅ Deploy to production

## Documentation Links

- [Full Implementation Guide](./PRODUCT_PINNING_GUIDE.md)
- [Implementation Summary](./PRODUCT_PINNING_IMPLEMENTATION.md)
- [Agora Documentation](https://docs.agora.io/)
- [Live Shopping README](./LIVE_SHOPPING_README.md)

## Support

For detailed information, see:
- `PRODUCT_PINNING_GUIDE.md` - Complete feature documentation
- `PRODUCT_PINNING_IMPLEMENTATION.md` - Implementation details
- Example page: `features/storefront/modules/live-shopping/pages/LiveShoppingPage.tsx`
