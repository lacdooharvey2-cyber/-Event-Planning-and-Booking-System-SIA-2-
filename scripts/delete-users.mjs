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

async function deleteNonAdminUsers() {
  loadEnvLocal()

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'evora_events_db',
  })

  try {
    console.log('🔍 Checking current users...')
    const [users] = await connection.query('SELECT id, email, name, role FROM users')
    console.table(users)

    console.log('\n🗑️ Deleting non-admin users...')
    const [result] = await connection.query('DELETE FROM users WHERE role != "admin"')

    console.log(`✅ Successfully deleted ${result.affectedRows} non-admin users`)

    console.log('\n🔍 Verifying remaining users...')
    const [remainingUsers] = await connection.query('SELECT id, email, name, role FROM users')
    console.table(remainingUsers)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await connection.end()
  }
}

deleteNonAdminUsers()