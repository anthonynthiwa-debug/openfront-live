export interface LiveSession {
  id: string;
  sessionId: string;
  title: string;
  description?: string;
  merchant: {
    id: string;
    name: string;
  };
  region: {
    id: string;
    name: string;
  };
  status: 'scheduled' | 'active' | 'ended' | 'archived';
  agoraChannelName: string;
  viewerCount: number;
  peakViewerCount: number;
  totalViews: number;
  totalPurchases: number;
  totalRevenue: number;
  scheduledStartTime: string;
  actualStartTime?: string;
  endTime?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StreamProduct {
  id: string;
  product: {
    id: string;
    title: string;
    description?: string;
  };
  variant?: {
    id: string;
    title: string;
    sku?: string;
  };
  sequenceOrder: number;
  streamPrice?: number;
  discount: number;
  impressions: number;
  clicks: number;
  purchases: number;
  conversionRate?: string;
  quantity: number;
  quantitySold: number;
  isAvailable: boolean;
  featuredAt: string;
  removedAt?: string;
}

export interface StreamPurchase {
  id: string;
  streamProduct: {
    id: string;
    product: {
      title: string;
    };
  };
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  customerEmail?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: {
    code: string;
    symbol: string;
  };
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  purchasedAt: string;
  completedAt?: string;
  stripePaymentIntentId?: string;
}

export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
  expiresIn: number;
}

export interface StreamBroadcastState {
  isActive: boolean;
  currentProductId?: string;
  pinnedProductId?: string;
  viewerCount: number;
  purchasesThisSession: number;
  revenueThisSession: number;
}

export interface PinnedProductMessage {
  type: 'productPinned' | 'productUnpinned';
  payload: {
    productId: string;
    productTitle: string;
    variantId?: string;
    variantTitle?: string;
    streamPrice?: number;
    discount?: number;
    quantity?: number;
    timestamp: number;
  } | null;
}
