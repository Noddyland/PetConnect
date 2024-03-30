const express = require('express');
const app = express();
const port = 5000;
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.use(express.json()); // for parsing application/json
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'petconnect'; 
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// connect to the database.
let db = new sqlite3.Database('./petconnect.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});


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

// SEARCH ROUTE
app.post('/search', (req, res) => {
  const { pet, city } = req.body; // doesnt use date.. for now!

  const sql = `
    SELECT u.id, u.username, u.email, u.phoneNumber, u.firstName, u.lastName, u.biography, u.accountStatus, u.role
    FROM users u
    JOIN minderStatus ms ON u.id = ms.minderId
    WHERE ms.active = 'true'
      AND ms.city = ?
      AND ms.${pet} = 'true'
      AND u.role = 'minder'
  `;

  db.all(sql, [city], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    // Send result.
    res.json(rows);
  });
});

app.post('/pets', (req, res) =>{
  const {userid} = req.body
  const sql = `
  SELECT *
  FROM pets 
  WHERE ownerId = ${userid}`;
  db.all(sql, [userid], (err, rows) => {
    if (err){
      console.error('error:', err.message, 'idk')
      res.status(500).json({error: err.message})
    }
    res.json(rows)
  })
})

app.post('/addpet', (req, res)=> {
  try {
    const {type, dob, breed, weight, diet, special, userid} = req.body
    const sql = `
    INSERT INTO pets (ownerId, type, dob, breed, weightKg, dietaryPreferences, specialRequirements) VALUES (?, ?, ?, ?, ?, ?, ?)`
    db.run(sql, [userid, type, dob, breed, weight, diet, special], function(err){
      if (err){
        res.status(400).json({"error": err.message});
        return;
      }
      res.json({
        "message": "success",
        "data": { id: this.lastID }
      });
    })
  } catch (error) {
    console.error('error:', error)
    res.status(500).json({'error': 'an error occured when trying to add pet'})
  }
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});