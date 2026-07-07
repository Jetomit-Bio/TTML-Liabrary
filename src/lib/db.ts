import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3307', 10),
      user: process.env.DB_USER || 'ttmllibuser',
      password: process.env.DB_PASSWORD || 'eU[1kM!d)g6qOF=a^!dc&#3peP$XkrTpB',
      database: process.env.DB_NAME || 'ttmllib',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}
