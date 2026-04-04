'use client'

export interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'venue_owner' | 'service_provider' | 'admin'
  phone?: string
  createdAt: string
}

export interface Booking {
  id: string
  userId: string
  items: BookingItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
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
}

export interface BookingItem {
  id: string
  type: 'venue' | 'service'
  name: string
  price: number
  quantity: number
  date?: string
}

export interface ServiceProvider {
  id: string
  userId: string
  businessName: string
  serviceType: string
  description: string
  rating: number
  totalBookings: number
  revenue: number
  logo?: string
  verified: boolean
  createdAt: string
}

export interface Service {
  id: string
  providerId: string
  name: string
  category: string
  description: string
  price: number
  rating: number
  image: string
  availability: string[]
}

// Storage Keys
const STORAGE_KEYS = {
  CURRENT_USER: 'eventhub_current_user',
  USERS: 'eventhub_users',
  BOOKINGS: 'eventhub_bookings',
  SERVICE_PROVIDERS: 'eventhub_service_providers',
  SERVICES: 'eventhub_services',
  CART: 'eventhub_cart',
}

// Initialize with sample data
function initializeSampleData() {
  if (typeof window === 'undefined') return

  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS)
  if (existingUsers) return // Already initialized

  // Sample users
  const sampleUsers: User[] = [
    {
      id: 'user-1',
      email: 'customer@example.com',
      name: 'Juan Dela Cruz',
      role: 'customer',
      phone: '09123456789',
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: 'user-2',
      email: 'venue@example.com',
      name: 'Maria Garcia',
      role: 'venue_owner',
      phone: '09987654321',
      createdAt: new Date('2024-01-10').toISOString(),
    },
    {
      id: 'user-3',
      email: 'provider@example.com',
      name: 'Roberto Santos',
      role: 'service_provider',
      phone: '09555555555',
      createdAt: new Date('2024-02-01').toISOString(),
    },
    {
      id: 'user-4',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      phone: '09111111111',
      createdAt: new Date('2024-01-01').toISOString(),
    },
    {
      id: 'user-admin-lacdooharvey',
      email: 'lacdooharvey2@gmail.com',
      name: 'Harvey Lacdoo',
      role: 'admin',
      phone: '09123456789',
      createdAt: new Date().toISOString(),
    },
  ]

  // Sample service providers
  const sampleProviders: ServiceProvider[] = [
    {
      id: 'provider-1',
      userId: 'user-3',
      businessName: 'Santos Photography',
      serviceType: 'Photography',
      description: 'Professional event photography with drone services',
      rating: 4.8,
      totalBookings: 45,
      revenue: 150000,
      verified: true,
      createdAt: new Date('2024-02-01').toISOString(),
    },
    {
      id: 'provider-2',
      userId: 'user-3',
      businessName: 'Gourmet Catering',
      serviceType: 'Catering',
      description: 'Premium catering services for all occasions',
      rating: 4.9,
      totalBookings: 67,
      revenue: 280000,
      verified: true,
      createdAt: new Date('2024-02-05').toISOString(),
    },
  ]

  // Sample services
  const sampleServices: Service[] = [
    {
      id: 'service-1',
      providerId: 'provider-1',
      name: 'Professional Photography',
      category: 'Photography',
      description: 'Full day coverage with high-quality prints',
      price: 15000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1606216174052-e7fb1d92c6f8?w=400',
      availability: ['2026-02-15', '2026-02-20', '2026-02-25'],
    },
    {
      id: 'service-2',
      providerId: 'provider-2',
      name: 'Premium Buffet Catering',
      category: 'Catering',
      description: 'Filipino and international cuisines',
      price: 800,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561404?w=400',
      availability: ['2026-02-15', '2026-02-20', '2026-02-25'],
    },
  ]

  // Sample bookings
  const sampleBookings: Booking[] = [
    {
      id: 'booking-1',
      userId: 'user-1',
      items: [
        { id: 'item-1', type: 'venue', name: 'The Grand Ballroom', price: 50000, quantity: 1 },
        { id: 'item-2', type: 'service', name: 'Professional Photography', price: 15000, quantity: 1 },
      ],
      totalAmount: 65000,
      status: 'confirmed',
      eventDate: '2026-02-20',
      guestCount: 100,
      location: 'Metro Manila',
      customerInfo: {
        name: 'Juan Dela Cruz',
        email: 'customer@example.com',
        phone: '09123456789',
      },
      paymentInfo: {
        method: 'Credit Card',
        cardLast4: '4242',
        transactionId: 'txn_001',
        paidAt: new Date('2026-02-01').toISOString(),
      },
      createdAt: new Date('2026-02-01').toISOString(),
      updatedAt: new Date('2026-02-01').toISOString(),
    },
  ]

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers))
  localStorage.setItem(STORAGE_KEYS.SERVICE_PROVIDERS, JSON.stringify(sampleProviders))
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(sampleServices))
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(sampleBookings))
}

// User Management
export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const users = getAllUsers()
  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))

  return newUser
}

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function getUserById(id: string): User | null {
  const users = getAllUsers()
  return users.find(u => u.id === id) || null
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

// Booking Management
export function createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
  const newBooking: Booking = {
    ...booking,
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const bookings = getAllBookings()
  bookings.push(newBooking)
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))

  return newBooking
}

export function getAllBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
  return data ? JSON.parse(data) : []
}

export function getBookingById(id: string): Booking | null {
  const bookings = getAllBookings()
  return bookings.find(b => b.id === id) || null
}

export function getUserBookings(userId: string): Booking[] {
  const bookings = getAllBookings()
  return bookings.filter(b => b.userId === userId)
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | null {
  const bookings = getAllBookings()
  const index = bookings.findIndex(b => b.id === id)

  if (index === -1) return null

  bookings[index] = {
    ...bookings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
  return bookings[index]
}

/** Append a new booking to localStorage (skip if id already exists). */
export function appendBooking(booking: Booking): void {
  if (typeof window === 'undefined') return
  const bookings = getAllBookings()
  if (bookings.some(b => b.id === booking.id)) return
  bookings.push(booking)
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))
}

// Service Provider Management
export function createServiceProvider(provider: Omit<ServiceProvider, 'id' | 'createdAt'>): ServiceProvider {
  const newProvider: ServiceProvider = {
    ...provider,
    id: `provider-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const providers = getAllServiceProviders()
  providers.push(newProvider)
  localStorage.setItem(STORAGE_KEYS.SERVICE_PROVIDERS, JSON.stringify(providers))

  return newProvider
}

export function getAllServiceProviders(): ServiceProvider[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.SERVICE_PROVIDERS)
  return data ? JSON.parse(data) : []
}

export function getServiceProviderByUserId(userId: string): ServiceProvider | null {
  const providers = getAllServiceProviders()
  return providers.find(p => p.userId === userId) || null
}

export function updateServiceProvider(id: string, updates: Partial<ServiceProvider>): ServiceProvider | null {
  const providers = getAllServiceProviders()
  const index = providers.findIndex(p => p.id === id)

  if (index === -1) return null

  providers[index] = { ...providers[index], ...updates }
  localStorage.setItem(STORAGE_KEYS.SERVICE_PROVIDERS, JSON.stringify(providers))

  return providers[index]
}

// Service Management
export function createService(service: Omit<Service, 'id'>): Service {
  const newService: Service = {
    ...service,
    id: `service-${Date.now()}`,
  }

  const services = getAllServices()
  services.push(newService)
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))

  return newService
}

export function getAllServices(): Service[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.SERVICES)
  return data ? JSON.parse(data) : []
}

export function getServicesByProviderId(providerId: string): Service[] {
  const services = getAllServices()
  return services.filter(s => s.providerId === providerId)
}

export function getServicesByCategory(category: string): Service[] {
  const services = getAllServices()
  return services.filter(s => s.category.toLowerCase() === category.toLowerCase())
}

// Cart Management
export function getCart(): Booking['items'] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEYS.CART)
  return data ? JSON.parse(data) : []
}

export function saveCart(items: Booking['items']): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items))
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.CART)
}

// Initialize on load
if (typeof window !== 'undefined') {
  initializeSampleData()
}
