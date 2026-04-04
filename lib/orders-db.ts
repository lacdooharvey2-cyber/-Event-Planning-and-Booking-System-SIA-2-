import type { Booking } from '@/lib/storage'
import { getPool } from '@/lib/db'

function toMysqlDateTime(iso: string): string {
  const d = new Date(iso)
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 19).replace('T', ' ')
  }
  return iso.slice(0, 19).replace('T', ' ')
}

/**
 * Persist a booking to MySQL (orders + order_items).
 * Expects tables from database/evora_events_schema.sql (or compatible).
 */
export async function insertBookingToDb(booking: Booking): Promise<void> {
  const pool = getPool()
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    await conn.execute(
      `INSERT INTO orders (
        id, user_id, total_amount, status, event_date, guest_count, location,
        customer_name, customer_email, customer_phone,
        payment_method, card_last4, transaction_id, paid_at,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        total_amount = VALUES(total_amount),
        status = VALUES(status),
        updated_at = VALUES(updated_at)`,
      [
        booking.id,
        booking.userId,
        booking.totalAmount,
        booking.status,
        booking.eventDate.slice(0, 10),
        booking.guestCount,
        booking.location,
        booking.customerInfo.name,
        booking.customerInfo.email,
        booking.customerInfo.phone,
        booking.paymentInfo.method,
        booking.paymentInfo.cardLast4,
        booking.paymentInfo.transactionId,
        toMysqlDateTime(booking.paymentInfo.paidAt),
        toMysqlDateTime(booking.createdAt),
        toMysqlDateTime(booking.updatedAt),
      ]
    )

    await conn.execute(`DELETE FROM order_items WHERE order_id = ?`, [booking.id])

    for (const item of booking.items) {
      const itemDate = item.date ? item.date.slice(0, 10) : null
      await conn.execute(
        `INSERT INTO order_items (order_id, item_type, catalog_id, name, price, quantity, event_item_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [booking.id, item.type, item.id, item.name, item.price, item.quantity, itemDate]
      )
    }

    await conn.commit()
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}
