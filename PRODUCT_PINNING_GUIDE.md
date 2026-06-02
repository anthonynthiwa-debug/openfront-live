# Product Pinning Feature - Implementation Guide

## Overview

The **Product Pinning** feature allows merchants to highlight a specific product during their live stream. The pinned product is displayed prominently to all viewers in real-time using Agora's signaling capabilities, enabling seamless product discovery and purchases during broadcasts.

## Architecture

### Components

1. **ProductSelectorWithPinning** - Merchant UI to select and pin products
2. **PinnedProductDisplay** - Customer UI to view pinned product details and buy
3. **LiveStreamBroadcaster** - Enhanced with pinning indicator
4. **LiveStreamViewer** - Enhanced to receive and display pinned products
5. **useAgoraSignaling** - Hook managing RTM (Real-Time Messaging) for pinning updates

### Data Flow

```
Broadcaster selects product
    ↓
ProductSelectorWithPinning calls /api/stream-products/pin
    ↓
API stores pinned product in cache
    ↓
useAgoraSignaling broadcasts message via Agora RTM
    ↓
LiveStreamViewers receive message via RTM listener
    ↓
PinnedProductDisplay renders product for all viewers
    ↓
Viewers can purchase via integrated checkout
```

## Real-Time Synchronization

### Agora RTM Messaging

The feature uses **Agora Real-Time Messaging (RTM)** for broadcasting product pinning updates:

```typescript
// Broadcaster pins a product
await broadcastPinnedProduct({
  productId: 'prod-123',
  productTitle: 'Wireless Headphones',
  variantId: 'var-456',
  variantTitle: 'Black - Medium',
  streamPrice: 79.99,
  discount: 15,
  quantity: 25,
  timestamp: Date.now(),
});

// Message sent via RTM:
{
  type: 'productPinned',
  payload: { /* pinned product data */ }
}
```

### Viewers Receive Updates

```typescript
// RTM channel listener receives message
rtmChannel.on('ChannelMessage', (message, memberId) => {
  const data = JSON.parse(message.text);
  if (data.type === 'productPinned') {
    setPinnedProduct(data.payload);
  }
});
```

## API Endpoints

### POST /api/stream-products/pin

Pins a product to a live stream session.

**Request:**
```json
{
  "sessionId": "session-123456",
  "productId": "prod-789",
  "variantId": "var-456" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product pinned successfully",
  "sessionId": "session-123456",
  "productId": "prod-789"
}
```

### DELETE /api/stream-products/pin

Unpins the current product from a live stream session.

**Request:**
```json
{
  "sessionId": "session-123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product unpinned successfully",
  "sessionId": "session-123456"
}
```

### GET /api/stream-products/pin

Retrieves the currently pinned product for a session.

**Query Parameters:**
- `sessionId` - The live session ID

**Response:**
```json
{
  "success": true,
  "sessionId": "session-123456",
  "pinnedProduct": {
    "productId": "prod-789",
    "variantId": "var-456",
    "pinnedAt": 1623456789000
  }
}
```

## Component Usage

### Broadcaster Side

```typescript
import { ProductSelectorWithPinning } from '@/features/storefront/modules/live-shopping/components/ProductSelectorWithPinning';
import { useAgoraSignaling } from '@/features/storefront/modules/live-shopping/hooks/useAgoraSignaling';

export function BroadcasterDashboard() {
  const { pinnedProduct, broadcastPinnedProduct, clearPinnedProduct } = useAgoraSignaling({
    channelName: 'live-stream-123',
    userId: 'merchant-456',
    agoraAppId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    agoraToken: agoraToken,
    role: 'publisher',
  });

  return (
    <ProductSelectorWithPinning
      sessionId="session-123"
      pinnedProduct={pinnedProduct}
      onProductPin={(product) => broadcastPinnedProduct(product)}
      onProductUnpin={clearPinnedProduct}
    />
  );
}
```

### Viewer Side

```typescript
import { LiveStreamViewer } from '@/features/storefront/modules/live-shopping/components/LiveStreamViewer';

export function CustomerLiveStream() {
  return (
    <LiveStreamViewer
      sessionId="session-123"
      channelName="live-stream-123"
      userId={customerUid}
      userIdString="customer-789"
      agoraAppId={process.env.NEXT_PUBLIC_AGORA_APP_ID}
      agoraToken={agoraToken}
      onBuyClick={(product) => {
        // Navigate to checkout with product
        navigateToCheckout(product);
      }}
    />
  );
}
```

## State Persistence

### During Stream

- Pinned product state is maintained in Agora RTM
- All viewers receive real-time updates via signaling
- Broadcaster can change pinned product at any time
- No pinning persists after stream ends (clears on broadcast stop)

### After Stream

- Stream purchases remain in database (`StreamPurchase` model)
- Product metrics (impressions, clicks, purchases) are saved
- Pinned product history can be queried from `StreamProduct` model

## UI Features

### Broadcaster Interface

- **Product List** - Shows all available products for the stream
- **Pin Button** - Click to pin a product (shows "📌 Pinned" when active)
- **Pinned Indicator** - Shows current pinned product in broadcast overlay
- **Unpin Button** - Click to remove current pinned product
- **Metrics** - Shows product impressions, clicks, sales in real-time

### Viewer Interface

- **Pinned Product Card** - Displays pinned product with:
  - Product image/name
  - Variant info
  - Price with discount badge
  - Available quantity
  - "Buy Now" button
- **Real-time Updates** - Card updates instantly when broadcaster changes pin
- **Responsiveness** - Mobile-optimized display

## Error Handling

### Pinning Failures

```typescript
try {
  await broadcastPinnedProduct(product);
} catch (error) {
  console.error('Failed to pin product:', error);
  showErrorNotification('Could not pin product. Please try again.');
}
```

### Connection Loss

- RTM automatically reconnects
- Pinned product state is restored from cache on reconnect
- Viewers see loading state during reconnection

### Out of Stock

- Pinned product quantity is validated before pin
- "Out of stock" message displays if quantity reaches 0
- Buy button is disabled for out-of-stock products

## Testing

### Manual Testing

1. **Start Broadcaster**
   - Go to broadcaster view
   - Click "Start Broadcast"
   - Verify broadcaster is connected to Agora channel

2. **Start Viewer**
   - Open viewer view in another tab/window
   - Verify viewer is connected to same channel
   - Confirm viewer count updates

3. **Test Pinning**
   - In broadcaster view, click "Pin" on a product
   - Verify pinned product displays in broadcaster view (indicator)
   - Check that pinned product appears in viewer view (card)
   - Verify real-time sync by changing pin

4. **Test Unpinning**
   - Click "Unpin" on pinned product
   - Verify product card disappears in viewer view
   - Check that broadcaster indicator clears

5. **Test Purchase**
   - Click "Buy Now" on pinned product in viewer
   - Verify purchase flow starts
   - Confirm purchase appears in broadcaster metrics

## Performance Considerations

- **RTM Message Size** - Payload is kept minimal (JSON serialized)
- **RTM Frequency** - Only sent when product is pinned/unpinned
- **State Updates** - Use React Context or component state (not polling)
- **Memory Usage** - Pinned product cache cleared on stream end

## Security

- **Server-side Validation** - API validates sessionId and productId
- **Token-based Access** - Agora tokens generated server-side
- **Role-based Control** - Only broadcasters can pin products
- **Data Isolation** - Each session isolated with unique channel name

## Future Enhancements

1. **Product History** - Track pinned products over time
2. **Auto-pinning** - Suggest products based on viewer engagement
3. **Multiple Pins** - Allow multiple products pinned simultaneously
4. **Pin Duration** - Auto-unpin after configurable time
5. **Pin Analytics** - Detailed metrics on pinned vs unpinned sales
6. **Product Rotation** - Automatically cycle through products
7. **A/B Testing** - Test different products during streams

## Troubleshooting

### Product not appearing in viewer

- Check RTM connection status
- Verify session ID matches between broadcaster and viewer
- Check browser console for RTM errors
- Ensure Agora credentials are configured

### Pinning button disabled

- Verify product has available quantity
- Check if broadcaster is actively broadcasting
- Confirm session is active

### Real-time updates delayed

- Check network latency
- Verify RTM channel is properly joined
- Check Agora dashboard for channel status

## Related Components

- `LiveStreamBroadcaster` - Main broadcaster component
- `LiveStreamViewer` - Main viewer component
- `ProductSelectorWithPinning` - Product selection UI
- `PinnedProductDisplay` - Product display card
- `useAgoraSignaling` - RTM hook
- `/api/stream-products/pin` - Pinning API endpoint
