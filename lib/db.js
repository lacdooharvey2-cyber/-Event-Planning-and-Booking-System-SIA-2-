const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // XAMPP default
  password: '',      // XAMPP default is empty
  database: 'evora_events' // The name of the DB we created earlier
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to XAMPP MySQL Database!');
});

module.exports = db;
