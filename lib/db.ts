import mysql from 'mysql2/promise';

// Ginagawa nito ang connection sa iyong XAMPP MySQL
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',        // Default username sa XAMPP
  password: '',        // Default password sa XAMPP ay walang laman (blank)
  database: 'event planning_booking system_db', // Palitan ng pangalan ng database na ginawa mo
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;