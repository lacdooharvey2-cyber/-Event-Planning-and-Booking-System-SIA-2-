import { NextRequest, NextResponse } from 'next/server'
import { updateOrderPaymentStatus } from '@/lib/payments-db'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid orderId. Must be a string.' },
        { status: 400 }
      )
    }

    // Update order payment status to 'paid' and payment method to 'online'
    await updateOrderPaymentStatus(orderId, 'online', 'paid')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment.' },
      { status: 500 }
    )
  }
}