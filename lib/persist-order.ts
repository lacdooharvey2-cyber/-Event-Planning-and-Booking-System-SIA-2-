import type { Booking } from '@/lib/storage'

/** Best-effort sync of a booking to MySQL (orders / order_items). Ignores failures. */
export function persistOrderRemote(booking: Booking): void {
  void fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  }).catch(() => {})
}
