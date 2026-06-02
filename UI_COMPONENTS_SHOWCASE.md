# Live Shopping UI Component Showcase

## Quick Component Reference

### 🎥 Viewer Components

#### LiveStreamEnhancedViewer
**Purpose**: Premium viewer experience with integrated product showcase
**Location**: `components/LiveStreamEnhancedViewer.tsx`

```typescript
<LiveStreamEnhancedViewer
  sessionId="session-123"
  channelName="live-stream"
  userId={viewerId}
  userIdString="viewer-1"
  agoraAppId={appId}
  agoraToken={viewerToken}
  onBuyClick={(product) => handleCheckout(product)}
/>
```

**Features**:
- Full-screen video container
- Side pinned product panel
- Real-time viewer count
- Engagement metrics
- Quick buy button
- Mobile optimized

#### PinnedProductDisplay
**Purpose**: Beautiful product card for viewers
**Location**: `components/PinnedProductDisplay.tsx`

```typescript
<PinnedProductDisplay
  product={pinnedProduct}
  onBuyClick={handleBuy}
/>
```

**Shows**:
- Product image
- Title & description
- Price with discount
- Quantity available
- CTA button

---

### 📺 Broadcaster Components

#### BroadcasterControlPanel
**Purpose**: Complete broadcaster control interface
**Location**: `components/BroadcasterControlPanel.tsx`

```typescript
<BroadcasterControlPanel
  sessionId="session-123"
  channelName="live-stream"
  userId={broadcasterId}
  userIdString="broadcaster-1"
  agoraAppId={appId}
  agoraToken={broadcasterToken}
/>
```

**Controls**:
- Stream start/stop
- Video preview
- Viewer metrics
- Duration timer
- Product pinning
- Quality settings

#### ProductSelectorWithPinning
**Purpose**: Product selection UI for broadcasters
**Location**: `components/ProductSelectorWithPinning.tsx`

```typescript
<ProductSelectorWithPinning
  sessionId="session-123"
  pinnedProduct={currentPinned}
  onProductPin={broadcastPin}
  onProductUnpin={clearPin}
/>
```

**Features**:
- Product list
- Pin/unpin buttons
- Stock status
- Price display
- Real-time engagement metrics

---

### 🛍️ Discovery Components

#### LiveShowCard
**Purpose**: Individual live show card
**Location**: `components/LiveShowCard.tsx`

```typescript
<LiveShowCard
  show={{
    id: "show-1",
    title: "Fashion Friday with Sarah",
    broadcaster: "Sarah's Store",
    category: "Fashion",
    viewerCount: 234,
    isLive: true,
  }}
  onClick={() => joinShow("show-1")}
/>
```

**Displays**:
- Live badge
- Show title
- Broadcaster name
- Viewer count
- Category tag
- Join button

#### LiveShowsCarousel
**Purpose**: Horizontal carousel of shows
**Location**: `components/LiveShowsCarousel.tsx`

```typescript
<LiveShowsCarousel
  shows={activeShows}
  onShowClick={(show) => router.push(`/live/${show.id}`)}
/>
```

**Features**:
- Horizontal scroll
- Multiple shows
- Category filters
- Empty states
- Responsive grid

---

### 📄 Page Templates

#### LiveShoppingLandingPage
**Purpose**: Main landing page
**Location**: `pages/LiveShoppingLandingPage.tsx`

```typescript
<LiveShoppingLandingPage />
```

**Sections**:
- Hero with featured show
- "Now Live" carousel
- "Coming Soon" section
- Category navigation
- Trending products
- Search bar

#### LiveShoppingPage
**Purpose**: Demo page with both modes
**Location**: `pages/LiveShoppingPage.tsx`

```typescript
<LiveShoppingPage />
```

**Tabs**:
- Broadcaster mode
- Viewer mode
- Product pinning demo

---

## Design Tokens

### Colors
```typescript
// Primary Brand
const brandColors = {
  primary: '#FF6B6B',      // Coral
  primaryDark: '#FF5757',  // Darker coral
  accent: '#F59E0B',       // Amber
  success: '#10B981',      // Emerald
};

// Neutral
const neutrals = {
  bg: '#FFFFFF',
  bgLight: '#F9FAFB',
  bgDark: '#1F2937',
  text: '#111827',
  textMuted: '#6B7280',
};
```

### Spacing
```typescript
// 8px base unit system
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  2xl: '48px',
};
```

### Typography
```typescript
// Font sizes
const typography = {
  h1: '2.5rem',    // 40px
  h2: '2rem',      // 32px
  h3: '1.5rem',    // 24px
  body: '1rem',    // 16px
  small: '0.875rem', // 14px
  tiny: '0.75rem', // 12px
};
```

---

## Common Patterns

### Responsive Variants

**Desktop (1024px+)**
```
[Video: 70%] [Product Panel: 30%]
            [Chat]
```

**Tablet (768px-1023px)**
```
[Video: 100%]
[Product Panel: 100%]
[Chat: 100%]
```

**Mobile (<768px)**
```
[Video: 100%]
[Pinned Product: Floating Card]
```

### State Management

**Viewer State**
- Connected/disconnected
- Loading/loaded
- Viewing/paused
- Product selection

**Broadcaster State**
- Idle/broadcasting
- Loading/streaming
- Product pinned/unpinned
- Metrics tracking

### Error Handling

All components include error boundaries for:
- Connection failures
- Token expiration
- Missing data
- Permission errors

---

## Integration Checklist

### Before Launching

- [ ] Set AGORA_APP_ID env var
- [ ] Generate broadcaster tokens
- [ ] Generate viewer tokens
- [ ] Test on mobile devices
- [ ] Test error scenarios
- [ ] Verify metrics display
- [ ] Test product pinning
- [ ] Test checkout flow
- [ ] Test on poor connections
- [ ] Performance profile

### After Launch

- [ ] Monitor real-time metrics
- [ ] Gather user feedback
- [ ] Track engagement rates
- [ ] Monitor error rates
- [ ] Optimize performance
- [ ] Add analytics events
- [ ] A/B test designs

---

## Customization Guide

### Change Brand Colors
Edit the Tailwind color classes in components:
```typescript
// From:
className="bg-red-600 text-white"
// To:
className="bg-blue-600 text-white"
```

### Add Custom Fonts
Update `layout.tsx`:
```typescript
import { YourFont } from 'next/font/google';

const font = YourFont({ subsets: ['latin'] });
```

### Modify Layout
Adjust grid/flex layouts in components:
```typescript
// From: 2-column
className="grid grid-cols-2"
// To: 3-column
className="grid grid-cols-3"
```

### Add More Sections
Duplicate existing sections in landing page:
```typescript
<LiveShowsCarousel title="Best Sellers" shows={bestSellers} />
<LiveShowsCarousel title="New Creators" shows={newCreators} />
```

---

## Performance Tips

### Optimize Images
```typescript
import Image from 'next/image';

<Image
  src={show.thumbnail}
  alt={show.title}
  width={400}
  height={300}
  priority={isAboveFold}
/>
```

### Lazy Load Components
```typescript
const BroadcasterPanel = dynamic(
  () => import('./BroadcasterControlPanel'),
  { loading: () => <Skeleton /> }
);
```

### Memoize Heavy Components
```typescript
export const LiveShowCard = memo(({ show, onClick }) => (
  // Component code
));
```

---

## Testing Components

### Unit Test Example
```typescript
import { render, screen } from '@testing-library/react';
import { LiveShowCard } from './LiveShowCard';

describe('LiveShowCard', () => {
  it('renders show title', () => {
    render(<LiveShowCard show={mockShow} />);
    expect(screen.getByText('Fashion Friday')).toBeInTheDocument();
  });

  it('displays viewer count', () => {
    render(<LiveShowCard show={mockShow} />);
    expect(screen.getByText('234')).toBeInTheDocument();
  });

  it('calls onClick when joined', () => {
    const onClick = jest.fn();
    render(<LiveShowCard show={mockShow} onClick={onClick} />);
    screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Integration Test Example
```typescript
describe('Live Shopping Flow', () => {
  it('viewer can join and see pinned product', async () => {
    // Navigate to live page
    // Verify video loads
    // Verify pinned product displays
    // Click buy button
    // Verify checkout initiates
  });
});
```

---

## Troubleshooting

### Component Not Rendering
1. Check imports
2. Verify props passed
3. Check console for errors
4. Clear Next.js cache

### Styling Issues
1. Verify Tailwind is configured
2. Check CSS import order
3. Clear build cache
4. Restart dev server

### Real-time Not Syncing
1. Verify token validity
2. Check RTM client initialization
3. Verify channel name matches
4. Check network connectivity

---

## Resources

### Documentation
- `/UI_ENHANCEMENTS_GUIDE.md` - Complete setup guide
- `/UI_ENHANCEMENTS_SUMMARY.md` - Feature breakdown
- `/PRODUCT_PINNING_GUIDE.md` - Pinning specifics

### External Resources
- [Agora Documentation](https://docs.agora.io/)
- [Next.js 16 Guide](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React 19 Guide](https://react.dev)

---

## Support

For issues or questions:
1. Check documentation files
2. Review component examples
3. Check console logs
4. Enable debug mode
5. Contact support team

---

**Happy building! 🚀**
