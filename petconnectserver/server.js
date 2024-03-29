const express = require('express');
const app = express();
const port = 5000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.json()); // for parsing application/json
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'petconnect'; 

// connect to the database.
let db = new sqlite3.Database('./petconnect.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});


// Example user object
const user = {
  id: 123,
  username: 'johndoe',
  email: 'john.doe@example.com',
  // You can include more fields as needed
};
const cors = require('cors')
app.use(cors())

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

// REGISTER ROUTE
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, phoneNumber, firstName, lastName, biography, userRole } = req.body;
    const accountStatus = "approved";

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO users (username, password, email, phoneNumber, firstName, lastName, biography, accountStatus, role) VALUES (?,?,?,?,?,?,?,?,?)';
    db.run(sql, [username, hashedPassword, email, phoneNumber, firstName, lastName, biography, accountStatus, userRole], function(err) {
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

  // SQL query to find the user by email
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
        // Passwords match, create a token with the actual user data
        const userToken = jwt.sign({
          user: {
            id: user.id, 
            username: user.username, 
            email: user.email, 
            phoneNumber: user.phoneNumber, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            biography: user.biography, 
            accountStatus: user.accountStatus, 
            role: user.role
          }
        }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        
        // Send the token as JSON
        res.json({ token: userToken });
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