import { NextResponse } from 'next/server'
import type { Booking } from '@/lib/storage'
import { insertBookingToDb } from '@/lib/orders-db'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Booking
    if (!body?.id || !body.userId || body.totalAmount == null) {
      return NextResponse.json({ error: 'Invalid booking payload' }, { status: 400 })
    }
    await insertBookingToDb(body)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to save order'
    console.error('[api/orders]', e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
