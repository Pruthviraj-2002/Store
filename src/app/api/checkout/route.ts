import { NextResponse } from 'next/server';
import { OrderService } from '@/services/OrderService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartId, profileId, shippingAddress, billingAddress } = body;

    if (!cartId || !profileId) {
      return NextResponse.json({ error: 'Cart ID and Profile ID required' }, { status: 400 });
    }

    const checkoutData = await OrderService.createOrder(cartId, profileId, shippingAddress, billingAddress);
    return NextResponse.json(checkoutData, { status: 200 });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initialize checkout' }, { status: 500 });
  }
}