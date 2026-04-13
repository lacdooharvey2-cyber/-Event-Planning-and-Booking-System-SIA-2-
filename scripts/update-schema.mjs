import fs from 'node:fs'
import path from 'node:path'
import { getPool } from './lib/db.js'

async function runSchemaUpdate() {
  try {
    // Read the schema file
    const schemaPath = path.resolve(process.cwd(), 'database', 'evora_events_schema.sql')
    const schemaContent = fs.readFileSync(schemaPath, 'utf8')

    // Split into individual statements (basic approach)
    const statements = schemaContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('SET'))

    const pool = getPool()

    console.log('Running schema updates...')

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.execute(statement)
          console.log('✓ Executed statement successfully')
        } catch (error) {
          // Ignore errors for CREATE TABLE IF NOT EXISTS
          if (!error.message.includes('already exists')) {
            console.log('Statement failed:', statement.substring(0, 100) + '...')
            console.log('Error:', error.message)
          }
        }
      }
    }

    console.log('Schema update completed!')

    // Verify payments table exists
    const [tables] = await pool.execute("SHOW TABLES LIKE 'payments'")
    if (tables.length > 0) {
      console.log('✓ Payments table created successfully')
    } else {
      console.log('✗ Payments table was not created')
    }

  } catch (error) {
    console.error('Schema update failed:', error)
  } finally {
    process.exit(0)
  }
}

runSchemaUpdate()