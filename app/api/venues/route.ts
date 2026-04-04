import { NextResponse } from 'next/server'
import { fetchVenuesFromDb } from '@/lib/catalog-db'

export async function GET() {
  try {
    const venues = await fetchVenuesFromDb()
    return NextResponse.json({ venues })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load venues'
    console.error('[api/venues]', e)
    return NextResponse.json({ error: message, venues: [] }, { status: 500 })
  }
}
