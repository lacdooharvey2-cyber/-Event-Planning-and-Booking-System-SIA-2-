'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function ConfirmPaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold">Payment Confirmed</h1>
          <p className="text-lg text-muted-foreground">
            Your payment has been processed successfully. You can review your booking details in the bookings page.
          </p>

          <Card className="p-6 bg-green-50 border-green-200">
            <p className="text-sm text-muted-foreground">
              This confirmation page is a simple static screen. The main payment logic still runs in the checkout flow.
            </p>
          </Card>

          <div className="flex gap-3 flex-wrap justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/bookings">View My Bookings</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/venues">Back</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}