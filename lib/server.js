const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the connection above

const app = express();
app.use(cors());
app.use(express.json());

// Example: Fetch all venues for your Venue Page
app.get('/api/venues', (req, res) => {
  const sql = "SELECT * FROM venues";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

// Example: Sign Up (POST request)
app.post('/api/signup', (req, res) => {
  const { full_name, email, password, role } = req.body;
  const sql = "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [full_name, email, password, role], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ message: "User created!", id: result.insertId });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});