import getSupabase from '@/lib/supabase'

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  paymentMethod:
    | 'credit_card'
    | 'debit_card'
    | 'bank_transfer'
    | 'cash'
    | 'paypal'
    | 'gcash'
    | 'maya'
    | 'other'
  paymentGateway?: string
  gatewayTransactionId?: string
  gatewayPaymentId?: string
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'refunded'
    | 'partially_refunded'
  cardBrand?: string
  cardLast4?: string
  cardCountry?: string
  failureReason?: string
  refundedAmount: number
  refundReason?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  completedAt?: string
}

function safeString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  return String(value)
}

function safeNumber(value: unknown): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function mapPaymentRow(row: Record<string, unknown>): Payment {
  return {
    id: safeString(row.id),
    orderId: safeString(row.order_id),
    amount: safeNumber(row.amount),
    currency: safeString(row.currency),
    paymentMethod: safeString(row.payment_method) as Payment['paymentMethod'],
    paymentGateway: row.payment_gateway ? safeString(row.payment_gateway) : undefined,
    gatewayTransactionId: row.gateway_transaction_id ? safeString(row.gateway_transaction_id) : undefined,
    gatewayPaymentId: row.gateway_payment_id ? safeString(row.gateway_payment_id) : undefined,
    status: safeString(row.status) as Payment['status'],
    cardBrand: row.card_brand ? safeString(row.card_brand) : undefined,
    cardLast4: row.card_last4 ? safeString(row.card_last4) : undefined,
    cardCountry: row.card_country ? safeString(row.card_country) : undefined,
    failureReason: row.failure_reason ? safeString(row.failure_reason) : undefined,
    refundedAmount: safeNumber(row.refunded_amount),
    refundReason: row.refund_reason ? safeString(row.refund_reason) : undefined,
    metadata: row.metadata ? JSON.parse(String(row.metadata)) : undefined,
    createdAt: safeString(row.created_at),
    updatedAt: safeString(row.updated_at),
    completedAt: row.completed_at ? safeString(row.completed_at) : undefined,
  }
}

export async function insertPayment(payment: Omit<Payment, 'createdAt' | 'updatedAt'>): Promise<void> {
  const now = new Date().toISOString()
  const { error } = await getSupabase().from('payments').insert([
    {
      id: payment.id,
      order_id: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      payment_method: payment.paymentMethod,
      payment_gateway: payment.paymentGateway ?? null,
      gateway_transaction_id: payment.gatewayTransactionId ?? null,
      gateway_payment_id: payment.gatewayPaymentId ?? null,
      status: payment.status,
      card_brand: payment.cardBrand ?? null,
      card_last4: payment.cardLast4 ?? null,
      card_country: payment.cardCountry ?? null,
      failure_reason: payment.failureReason ?? null,
      refunded_amount: payment.refundedAmount,
      refund_reason: payment.refundReason ?? null,
      metadata: payment.metadata ? JSON.stringify(payment.metadata) : null,
      created_at: now,
      updated_at: now,
      completed_at: payment.completedAt ?? null,
    },
  ])
  if (error) {
    throw new Error(`Failed to insert payment: ${error.message}`)
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['status'],
  completedAt?: string,
  failureReason?: string
): Promise<void> {
  const { error } = await getSupabase().from('payments').update({
    status,
    completed_at: completedAt ?? null,
    failure_reason: failureReason ?? null,
    updated_at: new Date().toISOString(),
  }).eq('id', paymentId)

  if (error) {
    throw new Error(`Failed to update payment status: ${error.message}`)
  }
}

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  const { data, error } = await getSupabase().from('payments').select('*').eq('id', paymentId).single()
  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Failed to fetch payment: ${error.message}`)
  }
  return data ? mapPaymentRow(data as Record<string, unknown>) : null
}

export async function getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
  const { data, error } = await getSupabase().from('payments').select('*').eq('order_id', orderId).order('created_at', { ascending: false })
  if (error) {
    throw new Error(`Failed to fetch payments for order ${orderId}: ${error.message}`)
  }
  return (data ?? []).map((row) => mapPaymentRow(row as Record<string, unknown>))
}

export async function processRefund(paymentId: string, refundAmount: number, refundReason?: string): Promise<void> {
  const { data, error } = await getSupabase().from('payments').select('amount, refunded_amount').eq('id', paymentId).single()
  if (error) {
    throw new Error(`Failed to load payment for refund: ${error.message}`)
  }

  const payment = data as Record<string, unknown>
  const amount = safeNumber(payment.amount)
  const currentRefunded = safeNumber(payment.refunded_amount)
  const totalRefunded = currentRefunded + refundAmount
  const status = totalRefunded >= amount ? 'refunded' : 'partially_refunded'

  const update = await getSupabase().from('payments').update({
    refunded_amount: totalRefunded,
    refund_reason: refundReason ?? null,
    status,
    updated_at: new Date().toISOString(),
  }).eq('id', paymentId)

  if (update.error) {
    throw new Error(`Failed to process refund: ${update.error.message}`)
  }
}

export async function getPaymentStats(): Promise<{
  totalPayments: number
  totalAmount: number
  completedPayments: number
  failedPayments: number
  refundedAmount: number
}> {
  const { data, error } = await getSupabase().rpc('payment_stats')

  if (error) {
    const summary = await getSupabase().from('payments').select('id', { count: 'estimated' }).single()
    if (summary.error) {
      throw new Error(`Failed to fetch payment stats: ${summary.error.message}`)
    }
    return {
      totalPayments: summary.count ?? 0,
      totalAmount: 0,
      completedPayments: 0,
      failedPayments: 0,
      refundedAmount: 0,
    }
  }

  const row = data as Record<string, unknown>
  return {
    totalPayments: safeNumber(row.total_payments),
    totalAmount: safeNumber(row.total_amount),
    completedPayments: safeNumber(row.completed_payments),
    failedPayments: safeNumber(row.failed_payments),
    refundedAmount: safeNumber(row.refunded_amount),
  }
}

export async function updateOrderPaymentStatus(orderId: string, paymentMethod: string, paymentStatus: string): Promise<void> {
  const { error } = await getSupabase().from('orders').update({
    payment_method: paymentMethod,
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  }).eq('id', orderId)

  if (error) {
    throw new Error(`Failed to update order payment status: ${error.message}`)
  }
}

// Example usage:
// await insertPayment(payment)
// await updatePaymentStatus('payment-123', 'completed', new Date().toISOString())
// const payment = await getPaymentById('payment-123')
// const payments = await getPaymentsByOrderId('order-456')
// await processRefund('payment-123', 100, 'Partial refund')
// await updateOrderPaymentStatus('order-456', 'credit_card', 'completed')
