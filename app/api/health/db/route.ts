import { NextResponse } from 'next/server'
import { queryDb } from '@/lib/db'

export async function GET() {
  try {
    await queryDb('SELECT 1 AS ok')
    return NextResponse.json({ ok: true, database: process.env.DATABASE_NAME ?? 'evora_events' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 503 })
  }
}
