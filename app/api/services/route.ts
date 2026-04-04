import { NextResponse } from 'next/server'
import { fetchServicesFromDb } from '@/lib/catalog-db'

export async function GET() {
  try {
    const services = await fetchServicesFromDb()
    return NextResponse.json({ services })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load services'
    console.error('[api/services]', e)
    return NextResponse.json({ error: message, services: [] }, { status: 500 })
  }
}
