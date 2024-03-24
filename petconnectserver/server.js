const express = require('express');
const app = express();
const port = 5000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.json()); // for parsing application/json
const sqlite3 = require('sqlite3').verbose();

// connect to the database.
let db = new sqlite3.Database('./petconnect.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// REGISTER ROUTE
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, phoneNumber, firstName, lastName, biography } = req.body;
    const accountStatus = "approved";

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO users (username, password, email, phoneNumber, firstName, lastName, biography, accountStatus) VALUES (?,?,?,?,?,?,?,?)';
    db.run(sql, [username, hashedPassword, email, phoneNumber, firstName, lastName, biography, accountStatus], function(err) {
      if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
      res.json({
        "message": "success",
        "data": { id: this.lastID }
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({"error": "An error occurred during registration"});
  }
});


// LOGIN ROUTE

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // SQL query to find the user by username
  const sql = 'SELECT * FROM users WHERE email = ?';

  db.get(sql, [email], (err, user) => {
    if (err) {
      res.status(500).json({ "error": err.message });
      return;
    }
    // User not found
    if (!user) {
      res.status(404).json({ "error": "User not found" });
      return;
    }

    // Compare the hashed password stored in the database with the password provided by the user
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({ "error": err.message });
        return;
      }
      if (result) {
        // Passwords match
        res.json({ "message": "Login successful!" });
      } else {
        // Passwords do not match
        res.status(401).json({ "error": "Invalid credentials" });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});