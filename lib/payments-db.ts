import { getPool } from '@/lib/db'

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'paypal' | 'gcash' | 'maya' | 'other'
  paymentGateway?: string
  gatewayTransactionId?: string
  gatewayPaymentId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded'
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

function toMysqlDateTime(iso: string): string {
  const d = new Date(iso)
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().slice(0, 19).replace('T', ' ')
  }
  return iso.slice(0, 19).replace('T', ' ')
}

/**
 * Insert a new payment record
 */
export async function insertPayment(payment: Omit<Payment, 'createdAt' | 'updatedAt'>): Promise<void> {
  const pool = getPool()
  const now = new Date().toISOString()

  await pool.execute(
    `INSERT INTO payments (
      id, order_id, amount, currency, payment_method, payment_gateway,
      gateway_transaction_id, gateway_payment_id, status, card_brand,
      card_last4, card_country, failure_reason, refunded_amount,
      refund_reason, metadata, created_at, updated_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payment.id,
      payment.orderId,
      payment.amount,
      payment.currency,
      payment.paymentMethod,
      payment.paymentGateway || null,
      payment.gatewayTransactionId || null,
      payment.gatewayPaymentId || null,
      payment.status,
      payment.cardBrand || null,
      payment.cardLast4 || null,
      payment.cardCountry || null,
      payment.failureReason || null,
      payment.refundedAmount,
      payment.refundReason || null,
      payment.metadata ? JSON.stringify(payment.metadata) : null,
      toMysqlDateTime(now),
      toMysqlDateTime(now),
      payment.completedAt ? toMysqlDateTime(payment.completedAt) : null,
    ]
  )
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: Payment['status'],
  completedAt?: string,
  failureReason?: string
): Promise<void> {
  const pool = getPool()
  const now = new Date().toISOString()

  await pool.execute(
    `UPDATE payments SET
      status = ?,
      completed_at = ?,
      failure_reason = ?,
      updated_at = ?
     WHERE id = ?`,
    [
      status,
      completedAt ? toMysqlDateTime(completedAt) : null,
      failureReason || null,
      toMysqlDateTime(now),
      paymentId,
    ]
  )
}

/**
 * Get payment by ID
 */
export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  const pool = getPool()
  const [rows] = await pool.execute(
    'SELECT * FROM payments WHERE id = ?',
    [paymentId]
  )

  if (rows.length === 0) return null

  const row = rows[0] as any
  return {
    id: row.id,
    orderId: row.order_id,
    amount: parseFloat(row.amount),
    currency: row.currency,
    paymentMethod: row.payment_method,
    paymentGateway: row.payment_gateway,
    gatewayTransactionId: row.gateway_transaction_id,
    gatewayPaymentId: row.gateway_payment_id,
    status: row.status,
    cardBrand: row.card_brand,
    cardLast4: row.card_last4,
    cardCountry: row.card_country,
    failureReason: row.failure_reason,
    refundedAmount: parseFloat(row.refunded_amount),
    refundReason: row.refund_reason,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  }
}

/**
 * Get all payments for an order
 */
export async function getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
  const pool = getPool()
  const [rows] = await pool.execute(
    'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC',
    [orderId]
  )

  return rows.map((row: any) => ({
    id: row.id,
    orderId: row.order_id,
    amount: parseFloat(row.amount),
    currency: row.currency,
    paymentMethod: row.payment_method,
    paymentGateway: row.payment_gateway,
    gatewayTransactionId: row.gateway_transaction_id,
    gatewayPaymentId: row.gateway_payment_id,
    status: row.status,
    cardBrand: row.card_brand,
    cardLast4: row.card_last4,
    cardCountry: row.card_country,
    failureReason: row.failure_reason,
    refundedAmount: parseFloat(row.refunded_amount),
    refundReason: row.refund_reason,
    metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  }))
}

/**
 * Process refund
 */
export async function processRefund(
  paymentId: string,
  refundAmount: number,
  refundReason?: string
): Promise<void> {
  const pool = getPool()
  const now = new Date().toISOString()

  await pool.execute(
    `UPDATE payments SET
      refunded_amount = refunded_amount + ?,
      refund_reason = ?,
      status = CASE
        WHEN refunded_amount + ? >= amount THEN 'refunded'
        ELSE 'partially_refunded'
      END,
      updated_at = ?
     WHERE id = ?`,
    [
      refundAmount,
      refundReason || null,
      refundAmount,
      toMysqlDateTime(now),
      paymentId,
    ]
  )
}

/**
 * Get payment statistics
 */
export async function getPaymentStats(): Promise<{
  totalPayments: number
  totalAmount: number
  completedPayments: number
  failedPayments: number
  refundedAmount: number
}> {
  const pool = getPool()
  const [rows] = await pool.execute(`
    SELECT
      COUNT(*) as total_payments,
      SUM(amount) as total_amount,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_payments,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
      SUM(refunded_amount) as refunded_amount
    FROM payments
  `)

  const row = rows[0] as any
  return {
    totalPayments: parseInt(row.total_payments) || 0,
    totalAmount: parseFloat(row.total_amount) || 0,
    completedPayments: parseInt(row.completed_payments) || 0,
    failedPayments: parseInt(row.failed_payments) || 0,
    refundedAmount: parseFloat(row.refunded_amount) || 0,
  }
}