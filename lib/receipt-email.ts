/** Plain-text receipt for email (no React / client-only imports). */

export type ReceiptBookingInput = {
  id: string
  status: string
  eventDate: string
  guestCount: number
  location: string
  totalAmount: number
  createdAt: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  paymentInfo: {
    method: string
    cardLast4: string
    transactionId: string
    paidAt: string
  }
  items: Array<{
    name: string
    type: string
    price: number
    quantity: number
    date?: string
  }>
}

export function formatReceiptPlainText(b: ReceiptBookingInput): string {
  const lines = [
    'EVORA EVENTS — PAYMENT RECEIPT',
    '================================',
    '',
    `Booking reference: ${b.id}`,
    `Date issued: ${new Date(b.createdAt).toLocaleString()}`,
    '',
    'CUSTOMER',
    `Name: ${b.customerInfo.name}`,
    `Email: ${b.customerInfo.email}`,
    `Phone: ${b.customerInfo.phone}`,
    '',
    'EVENT',
    `Event date: ${b.eventDate}`,
    `Guests: ${b.guestCount}`,
    `Location: ${b.location}`,
    `Booking status: ${b.status}`,
    '',
    'LINE ITEMS',
    ...b.items.map(
      (i) =>
        `• ${i.name} (${i.type})${i.date ? ` — ${i.date}` : ''}  Qty ${i.quantity}  ₱${(i.price * i.quantity).toLocaleString()}`
    ),
    '',
    `TOTAL PAID: ₱${b.totalAmount.toLocaleString()}`,
    '',
    'PAYMENT',
    `Method: ${b.paymentInfo.method}`,
    `Transaction: ${b.paymentInfo.transactionId}`,
    `Paid at: ${new Date(b.paymentInfo.paidAt).toLocaleString()}`,
    '',
    'Thank you for choosing Evora Events.',
    '',
    b.status === 'pending'
      ? 'Note: Your booking is pending admin confirmation. You will receive another update when it is confirmed.'
      : '',
  ].filter(Boolean)
  return lines.join('\n')
}

export function buildReceiptMailtoUrl(to: string, booking: ReceiptBookingInput): string {
  const text = formatReceiptPlainText(booking)
  const subject = 'Evora Events — Payment receipt'
  const max = 1900
  const body = text.length > max ? `${text.slice(0, max)}\n\n… (truncated — open booking details in Evora Events for full receipt)` : text
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
