import { NextResponse } from 'next/server'
import { fetchVenueByIdFromDb } from '@/lib/catalog-db'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  try {
    const venue = await fetchVenueByIdFromDb(id)
    if (!venue) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ venue })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load venue'
    console.error('[api/venues/[id]]', e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
