import { NextResponse } from 'next/server'
import { formatReceiptPlainText, buildReceiptMailtoUrl, type ReceiptBookingInput } from '@/lib/receipt-email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const to = typeof body.to === 'string' ? body.to.trim() : ''
    const booking = body.booking as ReceiptBookingInput | undefined

    if (!to || !booking?.id || !booking.customerInfo?.email) {
      return NextResponse.json({ error: 'Missing email or booking data' }, { status: 400 })
    }

    const text = formatReceiptPlainText(booking)
    const subject = 'Evora Events — Payment receipt'

    const apiKey = process.env.RESEND_API_KEY
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() || 'Evora Events <onboarding@resend.dev>'

    if (apiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
        }),
      })

      if (res.ok) {
        return NextResponse.json({ sent: true, channel: 'resend' as const })
      }

      const errText = await res.text().catch(() => '')
      console.error('Resend error:', res.status, errText)
    }

    const mailtoUrl = buildReceiptMailtoUrl(to, booking)
    return NextResponse.json({
      sent: false,
      channel: 'mailto' as const,
      mailtoUrl,
    })
  } catch (e) {
    console.error('email-receipt route:', e)
    return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 })
  }
}
