import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const content = fs.readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

const venues = [
  {
    id: 1,
    name: 'Secret Garden Pavilion',
    category: 'Garden',
    theme: 'Wedding',
    location: 'Metro Manila',
    price: 28000,
    capacity: 120,
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
    rating: 4.8,
    reviews: 156,
    description: 'Intimate garden venue with covered pavilion, ideal for elegant celebrations.',
    amenities: ['On-site parking (40 slots)', 'Bridal holding room', 'Basic sound system'],
  },
  {
    id: 2,
    name: 'Botanical Garden Venue',
    category: 'Garden',
    theme: 'Wedding',
    location: 'Quezon City',
    price: 36000,
    capacity: 180,
    image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
    rating: 4.7,
    reviews: 142,
    description: 'Botanical venue with landscaped gardens and a semi-covered reception area.',
    amenities: ['On-site parking (60 slots)', 'Air-cooled pavilion', 'Wi-Fi for guests'],
  },
  {
    id: 3,
    name: 'Glass Garden Hall',
    category: 'Function Room',
    theme: 'Corporate',
    location: 'Makati',
    price: 62000,
    capacity: 350,
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    rating: 4.9,
    reviews: 203,
    description: 'Large premium hall with floor-to-ceiling glass walls and full event tech setup.',
    amenities: ['Centralized air conditioning', 'Parking (100 slots)', 'Generator backup'],
  },
  {
    id: 4,
    name: 'Sunset Deck Beach Venue',
    category: 'Beach',
    theme: 'Christening',
    location: 'Cavite',
    price: 26000,
    capacity: 100,
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    rating: 4.5,
    reviews: 73,
    description: 'Affordable beachfront deck for intimate family events and ceremonies.',
    amenities: ['Beach access', 'Tent setup', 'Portable PA system'],
  },
  {
    id: 5,
    name: 'Studio White Events Hub',
    category: 'Studio',
    theme: 'Kiddie Party',
    location: 'Quezon City',
    price: 18000,
    capacity: 70,
    image_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    rating: 4.6,
    reviews: 91,
    description: 'Bright white studio space perfect for small celebrations and shoots.',
    amenities: ['Air conditioning', 'Kids play corner', 'Photo backdrop wall'],
  },
]

const services = [
  {
    id: 1,
    name: 'Professional Photography',
    category: 'Photography',
    price: 6500,
    description: '8 hours of professional event photography',
    image_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
    rating: 4.9,
    provider: 'Lens & Light Studios',
  },
  {
    id: 2,
    name: 'DJ & Sound System',
    category: 'Entertainment',
    price: 5500,
    description: 'Professional DJ with complete sound and lighting setup',
    image_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d7b?w=800&q=80',
    rating: 4.8,
    provider: 'Beat Masters Entertainment',
  },
  {
    id: 3,
    name: 'Catering Service',
    category: 'Catering',
    price: 12000,
    description: 'Full meal service for 100 guests with menu options',
    image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80',
    rating: 4.7,
    provider: 'Delicious Catering Co.',
  },
  {
    id: 4,
    name: 'Photo Booth (3 Hours)',
    category: 'Photography',
    price: 4200,
    description: 'Unlimited photo booth prints with props and digital copy.',
    image_url: 'https://images.unsplash.com/photo-1529634895163-5dd9f3b0f661?w=800&q=80',
    rating: 4.8,
    provider: 'SmileBox Booths',
  },
  {
    id: 5,
    name: 'Event Coordination (Day-of)',
    category: 'Planning',
    price: 7000,
    description: 'Day-of event coordinator with 2 assistants.',
    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    rating: 4.9,
    provider: 'PlanRight Events',
  },
]

const users = [
  { email: 'lacdooharvey2@gmail.com', name: 'Harvey Lacdoo', role: 'admin', phone: '09123456789' },
  { email: 'client@evora.com', name: 'Client User', role: 'customer', phone: '09123456789' },
  { email: 'venue@evora.com', name: 'Venue Manager', role: 'service_provider', phone: '09123456789' },
  { email: 'provider@evora.com', name: 'Service Provider', role: 'service_provider', phone: '09123456789' },
]

async function main() {
  loadEnvLocal()
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'evora_events',
    multipleStatements: true,
  })

  await connection.beginTransaction()
  try {
    await connection.query('DELETE FROM venue_themes')
    await connection.query('DELETE FROM services')
    await connection.query('DELETE FROM venues')
    await connection.query('DELETE FROM themes')

    for (const u of users) {
      await connection.query(
        `INSERT INTO users (email, password, full_name, role)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = VALUES(role)`,
        [u.email, 'google-or-local-login', u.name, u.role]
      )
    }

    const themeIds = new Map()
    const uniqueThemes = [...new Set(venues.map((v) => v.theme))]
    for (const t of uniqueThemes) {
      const [res] = await connection.query('INSERT INTO themes (theme_name) VALUES (?)', [t])
      themeIds.set(t, res.insertId)
    }

    for (const v of venues) {
      await connection.query(
        `INSERT INTO venues
         (id, name, category, location, price, capacity, image_url, rating, review_count, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [v.id, v.name, v.category, v.location, v.price, v.capacity, v.image_url, v.rating, v.reviews, v.description]
      )
      const themeId = themeIds.get(v.theme)
      if (themeId) {
        await connection.query('INSERT INTO venue_themes (venue_id, theme_id) VALUES (?, ?)', [v.id, themeId])
      }
    }

    for (const s of services) {
      await connection.query(
        `INSERT INTO services (id, service_name, category, base_price, price_unit, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [s.id, s.name, s.category, s.price, 'package', s.image_url]
      )
    }

    await connection.commit()
    console.log('Seed complete.')
    console.log(`Inserted venues: ${venues.length}`)
    console.log(`Inserted services: ${services.length}`)
    console.log(`Upserted users: ${users.length}`)
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    await connection.end()
  }
}

main().catch((err) => {
  console.error('DB seed failed:', err.message)
  process.exit(1)
})

