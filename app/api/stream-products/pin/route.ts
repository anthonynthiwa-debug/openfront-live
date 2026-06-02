import { NextRequest, NextResponse } from 'next/server';

// In-memory store for pinned products during this session
// In production, this would be stored in your database
const pinnedProductCache = new Map<string, any>();

/**
 * POST /api/stream-products/pin
 * Pins a product to a live stream session
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, productId, variantId } = await request.json();

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, productId' },
        { status: 400 }
      );
    }

    console.log('[v0] Pinning product:', { sessionId, productId, variantId });

    // Store pinned product
    pinnedProductCache.set(sessionId, {
      productId,
      variantId,
      pinnedAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Product pinned successfully',
      sessionId,
      productId,
    });
  } catch (error) {
    console.error('[v0] Error pinning product:', error);
    return NextResponse.json(
      { error: 'Failed to pin product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/stream-products/pin
 * Unpins the current product from a live stream session
 */
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing required field: sessionId' },
        { status: 400 }
      );
    }

    console.log('[v0] Unpinning product for session:', sessionId);

    // Remove pinned product
    pinnedProductCache.delete(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Product unpinned successfully',
      sessionId,
    });
  } catch (error) {
    console.error('[v0] Error unpinning product:', error);
    return NextResponse.json(
      { error: 'Failed to unpin product' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stream-products/pin
 * Gets the currently pinned product for a session
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing required parameter: sessionId' },
        { status: 400 }
      );
    }

    const pinnedProduct = pinnedProductCache.get(sessionId) || null;

    return NextResponse.json({
      success: true,
      sessionId,
      pinnedProduct,
    });
  } catch (error) {
    console.error('[v0] Error fetching pinned product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pinned product' },
      { status: 500 }
    );
  }
}
