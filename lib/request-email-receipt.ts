import type { Booking } from '@/lib/storage'

export type EmailReceiptResult =
  | { sent: true; channel: 'resend' }
  | { sent: false; channel: 'mailto'; mailtoUrl: string }
  | { error: string }

export async function requestEmailReceipt(to: string, booking: Booking): Promise<EmailReceiptResult> {
  try {
    const res = await fetch('/api/email-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, booking }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { error: typeof data.error === 'string' ? data.error : 'Request failed' }
    }
    if (data.sent === true) {
      return { sent: true, channel: 'resend' }
    }
    if (typeof data.mailtoUrl === 'string') {
      return { sent: false, channel: 'mailto', mailtoUrl: data.mailtoUrl }
    }
    return { error: 'Unexpected response' }
  } catch {
    return { error: 'Network error' }
  }
}
