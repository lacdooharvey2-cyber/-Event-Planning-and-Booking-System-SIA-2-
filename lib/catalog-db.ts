import type { RowDataPacket } from 'mysql2'
import { queryDb } from '@/lib/db'
import type { Service, Venue } from '@/lib/data'

type VenueRow = RowDataPacket & {
  id: number | string
  name: string
  category?: string | null
  location?: string | null
  price?: number | string | null
  capacity?: number | string | null
  rating?: number | string | null
  description?: string | null
  image?: string | null
  image_url?: string | null
  reviews?: number | string | null
  review_count?: number | string | null
  reviews_count?: number | string | null
  amenities?: string | Buffer | null
  theme_name?: string | null
}

type ServiceRow = RowDataPacket & {
  id: number | string
  name: string
  category?: string | null
  price?: number | string | null
  description?: string | null
  image?: string | null
  image_url?: string | null
  rating?: number | string | null
  provider?: string | null
  provider_name?: string | null
}

function parseAmenities(raw: VenueRow['amenities']): string[] {
  if (raw == null) return []
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8'))
    } catch {
      return []
    }
  }
  if (Array.isArray(raw)) {
    return raw.map(String)
  }
  if (typeof raw === 'object') {
    return []
  }
  const s = String(raw).trim()
  if (!s) return []
  try {
    const j = JSON.parse(s)
    return Array.isArray(j) ? j.map(String) : []
  } catch {
    return s.split(',').map((x) => x.trim()).filter(Boolean)
  }
}

export function mapVenueRow(row: VenueRow): Venue {
  const image = row.image_url || row.image || '/placeholder.svg'
  const reviews = Number(row.reviews ?? row.review_count ?? row.reviews_count ?? 0) || 0
  return {
    id: String(row.id),
    name: row.name,
    category: row.category ?? 'Other',
    theme: row.theme_name?.trim() || 'General',
    location: row.location ?? '',
    price: Number(row.price) || 0,
    capacity: Number(row.capacity) || 0,
    image,
    rating: Number(row.rating) || 0,
    reviews,
    description: row.description ?? '',
    amenities: parseAmenities(row.amenities),
  }
}

export function mapServiceRow(row: ServiceRow): Service {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category ?? 'Other',
    price: Number(row.price) || 0,
    description: row.description ?? '',
    image: row.image_url || row.image || '/placeholder.svg',
    rating: Number(row.rating) || 0,
    provider: row.provider ?? row.provider_name ?? 'Evora Partner',
  }
}

const VENUES_SQL = `
  SELECT
    v.*,
    (
      SELECT t.name
      FROM venue_themes vt
      INNER JOIN themes t ON t.id = vt.theme_id
      WHERE vt.venue_id = v.id
      ORDER BY vt.theme_id
      LIMIT 1
    ) AS theme_name
  FROM venues v
  ORDER BY v.id
`

const SERVICES_SQL = `
  SELECT *
  FROM services
  ORDER BY id
`

export async function fetchVenuesFromDb(): Promise<Venue[]> {
  try {
    const rows = await queryDb<VenueRow[]>(VENUES_SQL)
    return rows.map(mapVenueRow)
  } catch {
    const rows = await queryDb<VenueRow[]>(`SELECT * FROM venues ORDER BY id`)
    return rows.map((r) => mapVenueRow({ ...r, theme_name: null }))
  }
}

export async function fetchVenueByIdFromDb(id: string): Promise<Venue | null> {
  try {
    const rows = await queryDb<VenueRow[]>(
      `
      SELECT
        v.*,
        (
          SELECT t.name
          FROM venue_themes vt
          INNER JOIN themes t ON t.id = vt.theme_id
          WHERE vt.venue_id = v.id
          ORDER BY vt.theme_id
          LIMIT 1
        ) AS theme_name
      FROM venues v
      WHERE v.id = ?
      LIMIT 1
    `,
      [id]
    )
    if (!rows.length) return null
    return mapVenueRow(rows[0])
  } catch {
    const rows = await queryDb<VenueRow[]>(`SELECT * FROM venues WHERE id = ? LIMIT 1`, [id])
    if (!rows.length) return null
    return mapVenueRow({ ...rows[0], theme_name: null })
  }
}

export async function fetchServicesFromDb(): Promise<Service[]> {
  const rows = await queryDb<ServiceRow[]>(SERVICES_SQL)
  return rows.map(mapServiceRow)
}
