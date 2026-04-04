import mysql from 'mysql2/promise'

const globalForDb = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined
}

/**
 * Connection pool for `evora_events` (XAMPP / local MySQL).
 * Configure via .env.local — see .env.example
 */
export function getPool(): mysql.Pool {
  if (!globalForDb.mysqlPool) {
    globalForDb.mysqlPool = mysql.createPool({
      host: process.env.DATABASE_HOST ?? '127.0.0.1',
      port: Number(process.env.DATABASE_PORT ?? 3306),
      user: process.env.DATABASE_USER ?? 'root',
      password: process.env.DATABASE_PASSWORD ?? '',
      database: process.env.DATABASE_NAME ?? 'evora_events',
      waitForConnections: true,
      connectionLimit: Number(process.env.DATABASE_CONNECTION_LIMIT ?? 10),
      enableKeepAlive: true,
    })
  }
  return globalForDb.mysqlPool
}

export async function queryDb<T = mysql.RowDataPacket[]>(
  sql: string,
  params?: unknown[]
): Promise<T> {
  const pool = getPool()
  const [rows] = await pool.execute(sql, params)
  return rows as T
}
