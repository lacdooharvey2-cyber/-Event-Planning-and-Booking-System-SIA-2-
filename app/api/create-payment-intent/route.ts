import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number.' },
        { status: 400 }
      )
    }

    const secretKey = process.env.PAYMONGO_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: 'PayMongo secret key not configured.' },
        { status: 500 }
      )
    }

    // Convert amount to centavos (PayMongo expects amount in smallest currency unit)
    const amountInCentavos = Math.round(amount * 100)

    const response = await fetch('https://api.paymongo.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amountInCentavos,
            payment_method_allowed: ['card'],
            payment_method_options: {
              card: {
                request_three_d_secure: 'any',
              },
            },
            currency: 'PHP',
            capture_type: 'automatic',
          },
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('PayMongo API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to create payment intent.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const clientSecret = data.data.attributes.client_secret

    return NextResponse.json({ client_secret: clientSecret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}