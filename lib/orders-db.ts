import getSupabase from '@/lib/supabase'

interface OrderItemInput {
  id: string
  type: 'venue' | 'service'
  name: string
  price: number
  quantity: number
  date?: string
}

export interface OrderItem {
  id: string
  order_id: string
  item_type: 'venue' | 'service'
  catalog_id: string
  name: string
  price: number
  quantity: number
  event_item_date?: string | null
}

export interface OrderRecord {
  id: string
  user_id: string
  total_amount: number
  status: string
  event_date: string
  guest_count: number
  location: string
  customer_name: string
  customer_email: string
  customer_phone: string
  payment_method?: string | null
  payment_status?: string | null
  card_last4?: string | null
  transaction_id?: string | null
  paid_at?: string | null
  created_at: string
  updated_at: string
}

export interface OrderWithItems extends OrderRecord {
  items: OrderItem[]
}

function safeString(value: unknown, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  return String(value)
}

function safeNumber(value: unknown): number {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function mapOrderRow(row: Record<string, unknown>): OrderRecord {
  return {
    id: safeString(row.id),
    user_id: safeString(row.user_id),
    total_amount: safeNumber(row.total_amount),
    status: safeString(row.status),
    event_date: safeString(row.event_date),
    guest_count: safeNumber(row.guest_count),
    location: safeString(row.location),
    customer_name: safeString(row.customer_name),
    customer_email: safeString(row.customer_email),
    customer_phone: safeString(row.customer_phone),
    payment_method: row.payment_method ? safeString(row.payment_method) : null,
    payment_status: row.payment_status ? safeString(row.payment_status) : null,
    card_last4: row.card_last4 ? safeString(row.card_last4) : null,
    transaction_id: row.transaction_id ? safeString(row.transaction_id) : null,
    paid_at: row.paid_at ? safeString(row.paid_at) : null,
    created_at: safeString(row.created_at),
    updated_at: safeString(row.updated_at),
  }
}

function mapOrderItemRow(row: Record<string, unknown>): OrderItem {
  return {
    id: safeString(row.id),
    order_id: safeString(row.order_id),
    item_type: safeString(row.item_type) as 'venue' | 'service',
    catalog_id: safeString(row.catalog_id),
    name: safeString(row.name),
    price: safeNumber(row.price),
    quantity: safeNumber(row.quantity),
    event_item_date: row.event_item_date ? safeString(row.event_item_date) : null,
  }
}

export async function insertBookingToDb(booking: {
  id: string
  userId: string
  totalAmount: number
  status: string
  eventDate: string
  guestCount: number
  location: string
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
  createdAt: string
  updatedAt: string
  items: OrderItemInput[]
}): Promise<void> {
  const orderPayload = {
    id: booking.id,
    user_id: booking.userId,
    total_amount: booking.totalAmount,
    status: booking.status,
    event_date: booking.eventDate.slice(0, 10),
    guest_count: booking.guestCount,
    location: booking.location,
    customer_name: booking.customerInfo.name,
    customer_email: booking.customerInfo.email,
    customer_phone: booking.customerInfo.phone,
    payment_method: booking.paymentInfo.method,
    card_last4: booking.paymentInfo.cardLast4,
    transaction_id: booking.paymentInfo.transactionId,
    paid_at: booking.paymentInfo.paidAt,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
  }

  const { data: orderData, error: orderError } = await getSupabase().from('orders').insert(orderPayload).select().single()
  if (orderError || !orderData) {
    throw new Error(orderError?.message ?? 'Failed to insert order')
  }

  const itemsPayload = booking.items.map((item) => ({
    order_id: booking.id,
    item_type: item.type,
    catalog_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    event_item_date: item.date ? item.date.slice(0, 10) : null,
  }))

  if (itemsPayload.length > 0) {
    const { error: itemsError } = await getSupabase().from('order_items').insert(itemsPayload)
    if (itemsError) {
      throw new Error(itemsError.message)
    }
  }
}

export async function fetchOrderById(orderId: string): Promise<OrderWithItems | null> {
  const { data, error } = await getSupabase()
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch order ${orderId}: ${error.message}`)
  }

  if (!data) {
    return null
  }

  const order = mapOrderRow(data as Record<string, unknown>)
  const items = Array.isArray((data as any).order_items)
    ? (data as any).order_items.map(mapOrderItemRow)
    : []

  return { ...order, items }
}

export async function fetchOrdersWithItems(userId?: string): Promise<OrderWithItems[]> {
  let query = getSupabase().from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }

  return (data ?? []).map((row) => {
    const order = mapOrderRow(row as Record<string, unknown>)
    const items = Array.isArray((row as any).order_items)
      ? (row as any).order_items.map(mapOrderItemRow)
      : []
    return { ...order, items }
  })
}

// Example usage:
// await insertBookingToDb(bookingPayload)
// const order = await fetchOrderById('order-123')
// const orders = await fetchOrdersWithItems('user-123')
