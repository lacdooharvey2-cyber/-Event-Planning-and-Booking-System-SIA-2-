import { fetchCategories, fetchMenuItems } from '@/lib/catalog-db'
import { fetchOrdersWithItems } from '@/lib/orders-db'

export interface Venue {
  id: string
  name: string
  category: string
  theme: string
  location: string
  price: number
  capacity: number
  image: string
  rating: number
  reviews: number
  description: string
  amenities: string[]
}

export interface Service {
  id: string
  name: string
  category: string
  price: number
  description: string
  image: string
  rating: number
  provider: string
}

export const venues: Venue[] = [
  {
    id: 'v1',
    name: 'Secret Garden Pavilion',
    category: 'Garden',
    theme: 'Wedding',
    location: 'Metro Manila',
    price: 28000,
    capacity: 120,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    rating: 4.8,
    reviews: 156,
    description: 'Intimate garden venue with covered pavilion, ideal for elegant celebrations.',
    amenities: [
      'On-site parking (40 slots)',
      'Bridal holding room',
      'Basic sound system',
      'Garden and aisle lighting',
      'Round tables and chairs',
      'In-house coordination support',
    ],
  },
  {
    id: 'v2',
    name: 'Botanical Garden Venue',
    category: 'Garden',
    theme: 'Wedding',
    location: 'Quezon City',
    price: 36000,
    capacity: 180,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    rating: 4.7,
    reviews: 142,
    description: 'Botanical venue with landscaped gardens and a semi-covered reception area.',
    amenities: [
      'On-site parking (60 slots)',
      'Air-cooled pavilion',
      'LED wall and projector',
      'Catering prep kitchen',
      'Wi-Fi for guests',
      'Tables, chairs, and basic linens',
    ],
  },
  {
    id: 'v3',
    name: 'Glass Garden Hall',
    category: 'Function Room',
    theme: 'Corporate',
    location: 'Makati',
    price: 62000,
    capacity: 350,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    rating: 4.9,
    reviews: 203,
    description: 'Large premium hall with floor-to-ceiling glass walls and full event tech setup.',
    amenities: [
      'Centralized air conditioning',
      'Parking (100 slots)',
      'Built-in stage and backstage rooms',
      'Professional sound and lighting rig',
      'Dual LED walls',
      'Generator backup',
    ],
  },
  {
    id: 'v4',
    name: 'Night Bar by the Beach',
    category: 'Beach',
    theme: 'Birthday',
    location: 'Cavite',
    price: 42000,
    capacity: 220,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.6,
    reviews: 98,
    description: 'Beachfront event space with sunset ceremony area and lively night reception zone.',
    amenities: [
      'Beachfront access',
      'DJ booth and dance floor',
      'Bar counter and service staff area',
      'Outdoor mood lighting',
      'Event security personnel',
      'Rain contingency tent setup',
    ],
  },
  {
    id: 'v5',
    name: 'Fine Dining Rooftop with Fireworks',
    category: 'Rooftop',
    theme: 'Debut',
    location: 'Manila',
    price: 54000,
    capacity: 260,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    rating: 5,
    reviews: 267,
    description: 'High-rise rooftop venue with skyline views, ideal for premium dinners and debut receptions.',
    amenities: [
      'Valet and basement parking',
      'Fine dining kitchen access',
      'Premium bar setup',
      'Skyline viewing deck',
      'Fireworks coordination option',
      'VIP lounge area',
    ],
  },
  {
    id: 'v6',
    name: 'Tagaytay Ridge Events Place',
    category: 'Function Room',
    theme: 'Reunion',
    location: 'Tagaytay',
    price: 24000,
    capacity: 90,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    rating: 4.6,
    reviews: 84,
    description: 'Cozy ridge-side function space with cool weather and mountain views.',
    amenities: ['Parking (25 slots)', 'Fan and AC mix', 'Basic lights', 'Stage area'],
  },
  {
    id: 'v7',
    name: 'City Loft Social Hall',
    category: 'Loft',
    theme: 'Birthday',
    location: 'Makati',
    price: 30000,
    capacity: 140,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
    rating: 4.7,
    reviews: 126,
    description: 'Industrial loft style venue ideal for birthdays, debuts, and private parties.',
    amenities: ['Indoor parking', 'Sound system', 'Movable tables/chairs', 'Prep room'],
  },
  {
    id: 'v8',
    name: 'Pearl Ballroom',
    category: 'Ballroom',
    theme: 'Wedding',
    location: 'Manila',
    price: 75000,
    capacity: 420,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    rating: 4.8,
    reviews: 211,
    description: 'Classic ballroom with chandeliers and large capacity for formal events.',
    amenities: ['Parking (120 slots)', 'Grand stage', 'Lighting grid', 'Backup generator'],
  },
  {
    id: 'v9',
    name: 'Sunset Deck Beach Venue',
    category: 'Beach',
    theme: 'Christening',
    location: 'Cavite',
    price: 26000,
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.5,
    reviews: 73,
    description: 'Affordable beachfront deck for intimate family events and ceremonies.',
    amenities: ['Beach access', 'Tent setup', 'Portable PA system', 'Security gate'],
  },
  {
    id: 'v10',
    name: 'Studio White Events Hub',
    category: 'Studio',
    theme: 'Kiddie Party',
    location: 'Quezon City',
    price: 18000,
    capacity: 70,
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    rating: 4.6,
    reviews: 91,
    description: 'Bright white studio space perfect for small celebrations and shoots.',
    amenities: ['Air conditioning', 'Kids play corner', 'Photo backdrop wall', 'Wi-Fi'],
  },
]

export const services: Service[] = [
  {
    id: 's1',
    name: 'Professional Photography',
    category: 'Photography',
    price: 6500,
    description: '8 hours of professional event photography',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
    rating: 4.9,
    provider: 'Lens & Light Studios',
  },
  {
    id: 's2',
    name: 'DJ & Sound System',
    category: 'Entertainment',
    price: 5500,
    description: 'Professional DJ with complete sound and lighting setup',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d7b?w=800&q=80',
    rating: 4.8,
    provider: 'Beat Masters Entertainment',
  },
  {
    id: 's3',
    name: 'Catering Service',
    category: 'Catering',
    price: 12000,
    description: 'Full meal service for 100 guests with menu options',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
    rating: 4.7,
    provider: 'Delicious Catering Co.',
  },
  {
    id: 's4',
    name: 'Floral Decoration',
    category: 'Decoration',
    price: 8500,
    description: 'Premium floral arrangements and venue decoration',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    rating: 4.9,
    provider: 'Bloom & Blossom Designs',
  },
  {
    id: 's5',
    name: 'Videography',
    category: 'Videography',
    price: 7500,
    description: '8 hours of professional video coverage with editing',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    rating: 4.8,
    provider: 'Cinema Craft Productions',
  },
  {
    id: 's6',
    name: 'Host / Emcee Package',
    category: 'Entertainment',
    price: 4500,
    description: 'Experienced host for 4-hour program flow and audience engagement.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    rating: 4.7,
    provider: 'Bright Mic Hosts',
  },
  {
    id: 's7',
    name: 'Basic Grazing Table',
    category: 'Catering',
    price: 3800,
    description: 'Snack and appetizer table setup for up to 60 guests.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80',
    rating: 4.6,
    provider: 'Snack Lane Catering',
  },
  {
    id: 's8',
    name: 'Photo Booth (3 Hours)',
    category: 'Photography',
    price: 4200,
    description: 'Unlimited photo booth prints with props and digital copy.',
    image: 'https://images.unsplash.com/photo-1529634895163-5dd9f3b0f661?w=800&q=80',
    rating: 4.8,
    provider: 'SmileBox Booths',
  },
  {
    id: 's9',
    name: 'String Lights Styling',
    category: 'Decoration',
    price: 3000,
    description: 'Warm string lights and ceiling drape styling for cozy ambiance.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    rating: 4.6,
    provider: 'Glow Event Styling',
  },
  {
    id: 's10',
    name: 'Event Coordination (Day-of)',
    category: 'Planning',
    price: 7000,
    description: 'Day-of event coordinator with 2 assistants.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    rating: 4.9,
    provider: 'PlanRight Events',
  },
  {
    id: 's11',
    name: 'Mobile Coffee Cart',
    category: 'Catering',
    price: 4800,
    description: 'Coffee cart with barista service for 3 hours.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    rating: 4.7,
    provider: 'Brew Wheels PH',
  },
  {
    id: 's12',
    name: 'Acoustic Duo Performance',
    category: 'Entertainment',
    price: 6000,
    description: 'Live acoustic duo set for ceremony and dinner reception.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    rating: 4.8,
    provider: 'Harbor Strings Duo',
  },
]

export const categories = ['All', 'Function Room', 'Garden', 'Beach', 'Rooftop', 'Ballroom', 'Loft', 'Studio']
export const venueThemes = ['All Themes', 'Wedding', 'Kiddie Party', 'Debut', 'Birthday', 'Corporate', 'Christening', 'Reunion']
export const locations = ['All Locations', 'Metro Manila', 'Quezon City', 'Makati', 'Cavite', 'Manila', 'Tagaytay']
export const serviceCategories = ['Photography', 'Videography', 'Entertainment', 'Catering', 'Decoration', 'Planning']

export interface Category {
  id: string
  name: string
  description?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface MenuItem {
  id: string
  categoryId: string | null
  name: string
  description?: string | null
  price: number
  imageUrl?: string | null
  categoryName?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface OrderSummary {
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
  items: {
    id: string
    order_id: string
    item_type: 'venue' | 'service'
    catalog_id: string
    name: string
    price: number
    quantity: number
    event_item_date?: string | null
  }[]
}

export async function fetchCatalog(): Promise<{ categories: Category[]; menuItems: MenuItem[] }> {
  const [categories, menuItems] = await Promise.all([fetchCategories(), fetchMenuItems()])
  return { categories, menuItems }
}

export async function fetchOrdersSummary(userId?: string): Promise<OrderSummary[]> {
  return fetchOrdersWithItems(userId)
}

export async function fetchCatalogAndOrders(userId?: string): Promise<{
  categories: Category[]
  menuItems: MenuItem[]
  orders: OrderSummary[]
}> {
  const [catalog, orders] = await Promise.all([fetchCatalog(), fetchOrdersSummary(userId)])
  return {
    categories: catalog.categories,
    menuItems: catalog.menuItems,
    orders,
  }
}
