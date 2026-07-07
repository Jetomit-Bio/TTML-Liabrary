const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: '/var/www/ttmllib/.env.local' });

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD length:", process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
console.log("DB_PASSWORD value:", process.env.DB_PASSWORD);

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("SUCCESS");
    await conn.end();
  } catch (err) {
    console.error("FAIL:", err.message);
  }
}
test();
