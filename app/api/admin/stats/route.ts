import { NextResponse } from 'next/server'
import { queryDb } from '@/lib/db'

type OneRow = Record<string, unknown>

async function scalar(sql: string, field: string): Promise<number> {
  try {
    const rows = await queryDb<OneRow[]>(sql)
    const value = rows?.[0]?.[field]
    return Number(value ?? 0) || 0
  } catch {
    return 0
  }
}

export async function GET() {
  try {
    const [venuesCount, servicesCount, ordersCount, pendingOrders, revenueAllTime, revenueThisMonth, usersCount] =
      await Promise.all([
        scalar('SELECT COUNT(*) AS count FROM venues', 'count'),
        scalar('SELECT COUNT(*) AS count FROM services', 'count'),
        scalar('SELECT COUNT(*) AS count FROM orders', 'count'),
        scalar("SELECT COUNT(*) AS count FROM orders WHERE status = 'pending'", 'count'),
        scalar('SELECT COALESCE(SUM(total_amount), 0) AS amount FROM orders', 'amount'),
        scalar(
          `SELECT COALESCE(SUM(total_amount), 0) AS amount
           FROM orders
           WHERE YEAR(created_at) = YEAR(CURRENT_DATE())
             AND MONTH(created_at) = MONTH(CURRENT_DATE())`,
          'amount'
        ),
        scalar('SELECT COUNT(*) AS count FROM users', 'count'),
      ])

    return NextResponse.json({
      ok: true,
      stats: {
        venuesCount,
        servicesCount,
        ordersCount,
        pendingOrders,
        revenueAllTime,
        revenueThisMonth,
        usersCount,
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load admin stats'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
