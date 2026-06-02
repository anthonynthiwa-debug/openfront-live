# Live Shopping Platform - Agora Integration Implementation

## Overview

This implementation adds real-time live shopping capabilities to the openfront platform using Agora's real-time communication infrastructure. Merchants can broadcast live product showcases, and customers can watch, interact, and purchase products in real-time.

## Architecture

### Database Models

Three new Keystone models have been added to support live shopping:

1. **LiveSession** - Represents an active or scheduled live broadcast
   - Tracks merchant, region, Agora channel details
   - Stores viewer counts, purchases, and revenue metrics
   - Links to stream products and purchases

2. **StreamProduct** - Products featured during a live session
   - Associates with Product/ProductVariant
   - Tracks engagement metrics (impressions, clicks, purchases)
   - Stores stream-specific pricing and discounts

3. **StreamPurchase** - Records purchases made during a stream
   - Links customer, stream product, and payment details
   - Tracks payment status and conversion
   - Integrates with existing Stripe checkout

### API Endpoints

#### `/api/agora/token` (POST)
- **Purpose**: Generate Agora RTC tokens for video/audio
- **Auth**: Required (user session)
- **Request**:
  ```json
  {
    "channelName": "live_session_123",
    "uid": 0,
    "role": "publisher" | "subscriber"
  }
  ```
- **Response**:
  ```json
  {
    "token": "...",
    "appId": "...",
    "channelName": "...",
    "uid": 0,
    "expiresIn": 3600
  }
  ```

#### `/api/live-sessions` (GET/POST)
- **GET**: Fetch active live sessions
- **POST**: Create a new live session
- **Auth**: Required

#### `/api/stream-products` (GET/POST/PATCH/DELETE)
- **GET**: Fetch products in a stream by sessionId
- **POST**: Add a product to the stream
- **PATCH**: Update product metrics/availability
- **DELETE**: Remove product from stream
- **Auth**: Required for write operations

#### `/api/stream-purchases` (GET/POST/PATCH)
- **GET**: Fetch purchases for a session
- **POST**: Record a new purchase
- **PATCH**: Update payment status
- **Auth**: Required

### Components

#### LiveStreamViewer
- Customer-facing component to watch broadcasts
- Uses Agora RTCProvider for video reception
- Displays remote broadcaster streams

#### LiveStreamBroadcaster
- Merchant-facing component to broadcast
- Controls camera and microphone
- Displays local video preview

#### ProductSelector
- Allows merchants to manage featured products
- Shows real-time engagement metrics
- Lets merchants add/remove products during broadcast

### Hooks

#### useAgoraConnection
- Manages Agora token generation and lifecycle
- Handles token expiration warnings
- Provides connection state and error handling

#### useAgoraSignaling
- Manages RTM (Real-Time Messaging) for signaling
- Used for product updates and merchant notifications

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local`:

```
AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate
KEYSTONE_ENDPOINT=http://localhost:3000/api/graphql
```

Get Agora credentials from [Agora Console](https://console.agora.io).

### 2. Database Migration

Run the Keystone migration to add new models:

```bash
npm run migrate
```

This creates three new tables:
- `LiveSession`
- `StreamProduct`
- `StreamPurchase`

### 3. Install Dependencies

Already included in the package.json update:

```bash
npm install agora-token agora-rtc-sdk-ng
```

### 4. Rebuild Keystone

```bash
npm run build
```

## Usage Examples

### Creating a Live Session (Merchant)

```typescript
const response = await fetch('/api/live-sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Summer Collection Launch',
    description: 'Join us for an exclusive preview',
    regionId: 'region_123',
    channelName: 'summer_launch_2024',
    scheduledStartTime: new Date('2024-06-01T18:00:00Z'),
  }),
});
```

### Joining a Broadcast (Customer)

```typescript
const { token, appId } = await fetch('/api/agora/token', {
  method: 'POST',
  body: JSON.stringify({
    channelName: 'summer_launch_2024',
    role: 'subscriber',
    uid: 123,
  }),
}).then(r => r.json());

// Use token to initialize AgoraRTCProvider and LiveStreamViewer
```

### Recording a Purchase

```typescript
const response = await fetch('/api/stream-purchases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'live_session_123',
    streamProductId: 'stream_product_456',
    quantity: 2,
    unitPrice: 2999, // cents
    currencyId: 'currency_usd',
    customerEmail: 'customer@example.com',
  }),
});
```

## Integration with Stripe

Stream purchases are recorded separately but can be linked to Stripe checkout:

1. Create stream purchase record (pending status)
2. Initialize Stripe checkout with same product/amount
3. Update stream purchase with Stripe payment intent ID on success
4. Update payment status to 'completed' when Stripe webhook confirms payment

## Real-time Features

### Agora RTM for Signaling

Product updates and merchant notifications flow through Agora RTM:

```typescript
// Send product update to viewers
rtmChannel.sendMessage({
  type: 'product_updated',
  productId: 'stream_product_456',
  newPrice: 1999,
  quantityRemaining: 5,
});

// Notify merchant of new purchase
rtmChannel.sendMessage({
  type: 'purchase_notification',
  purchaseId: 'stream_purchase_789',
  quantity: 2,
  totalAmount: 5998,
});
```

## Metrics & Analytics

Stream sessions track:
- `viewerCount` - Current active viewers
- `peakViewerCount` - Highest concurrent viewers
- `totalViews` - Cumulative view count
- `totalPurchases` - Total transactions
- `totalRevenue` - Revenue in base currency

Products track:
- `impressions` - Times product was visible
- `clicks` - Product interactions
- `purchases` - Number sold
- `conversionRate` - Click-to-purchase ratio

## Performance Considerations

1. **Token Expiration**: Tokens expire in 1 hour. The `useAgoraConnection` hook warns at 5 minutes remaining.

2. **Concurrent Limits**: Agora channels support up to 1,000 concurrent users in subscriber mode.

3. **Channel Cleanup**: Automatically leave channels on component unmount.

4. **Polling**: ProductSelector polls for updates every 5 seconds. Consider reducing or using WebSockets for high-volume streams.

## Browser Support

- Chrome/Chromium 49+
- Firefox 38+
- Safari 11+
- Edge 79+

WebRTC is required for video/audio streaming.

## Testing

### Local Development

```bash
npm run dev
```

Test with:
1. Create a live session in Keystone admin
2. Start merchant broadcast
3. Join as subscriber on another browser tab
4. Make a test purchase

### Error Scenarios

- Invalid Agora credentials → 500 error from `/api/agora/token`
- No active session → Empty viewer list
- Network interruption → Auto-reconnect after 30s
- Token expiry during stream → Automatic re-token before expiry

## Troubleshooting

### "Failed to join stream"
- Check Agora credentials in .env.local
- Verify channel name is valid (max 64 chars)
- Ensure UID is between 0-4294967295

### "Token generation failed"
- Verify AGORA_APP_ID and AGORA_APP_CERTIFICATE are set
- Check network connectivity
- Ensure user is authenticated

### "No video from broadcaster"
- Browser may be blocking camera access → Check permissions
- Camera might be in use elsewhere → Close other apps
- Verify `localCameraTrack` is playing correctly

## Future Enhancements

1. **Filters & Effects**: Add Banuba or similar for broadcaster effects
2. **Chat**: Implement RTM-based in-stream chat
3. **Testimonials**: Showcase customer reviews during stream
4. **Multiple Camera Angles**: Support multi-view broadcasting
5. **Recording**: Store broadcast video for replay
6. **Analytics Dashboard**: Detailed engagement analytics
7. **Automated Checkout**: Skip Stripe redirect with native payment

## Related Files

- `/features/keystone/models/LiveSession.ts` - Database schema
- `/features/keystone/models/StreamProduct.ts` - Product schema
- `/features/keystone/models/StreamPurchase.ts` - Purchase schema
- `/lib/agora-service.ts` - Token generation utilities
- `/app/api/agora/token/route.ts` - Token API
- `/app/api/live-sessions/route.ts` - Session management API
- `/app/api/stream-products/route.ts` - Product management API
- `/app/api/stream-purchases/route.ts` - Purchase tracking API
- `/features/storefront/modules/live-shopping/` - UI components and hooks
