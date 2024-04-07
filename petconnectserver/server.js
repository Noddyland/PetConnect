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

app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

// REGISTER ROUTE
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, phoneNumber, firstName, lastName, biography, userRole } = req.body;
    var accountStatus = "";
    if(userRole == "minder"){
      accountStatus = "pending";
    } else {
      accountStatus = "approved";
    }
    

    // Hash the password with bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO users (username, password, email, phoneNumber, firstName, lastName, biography, accountStatus, role) VALUES (?,?,?,?,?,?,?,?,?)';
    db.run(sql, [username, hashedPassword, email, phoneNumber, firstName, lastName, biography, accountStatus, userRole], function (err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": { id: this.lastID }
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ "error": "An error occurred during registration" });
  }
});


// LOGIN ROUTE

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';

  db.get(sql, [email], (err, user) => {
    if (err) {
      res.status(500).json({ "error": err.message });
      return;
    }
    if (!user) {
      res.status(404).json({ "error": "User not found" });
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({ "error": err.message });
        return;
      }
      if (!result) {
        res.status(401).json({ "error": "Invalid credentials!" });
        return;
      }

      // check the user's account status
      if(user.accountStatus == "pending"){
        res.status(401).json({ "error": "Your account is awaiting approval by a moderator!" });
        return;
      }

      if(user.accountStatus == "banned"){
        res.status(401).json({ "error": "You are banned!" });
        return;
      }

      // create the token
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
      }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token: userToken });
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

// GET PETS ROUTE 
app.get('/pets/:userid', (req, res) => {
  const { userid } = req.params;
  const sql = `
    SELECT *
    FROM pets 
    WHERE ownerId = ?`;

  db.all(sql, [userid], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// ADD PET ROUTE

app.post('/addpet', (req, res) => {
  try {
    const { userid, petName, type, dob, breed, weight, diet, special, emergencyNumber } = req.body
    const sql = `
    INSERT INTO pets (ownerId, name, type, dob, breed, weightKg, dietaryPreferences, specialRequirements, EmergencyContactInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    db.run(sql, [userid, petName, type, dob, breed, weight, diet, special, emergencyNumber], function (err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": { id: this.lastID }
      });
    })
  } catch (error) {
    console.error('error:', error)
    res.status(500).json({ 'error': 'an error occured when trying to add pet' })
  }
})

// REMOVE PET ROUTE
app.delete('/removepet/:petId', (req, res) => {
  try {
    const { petId } = req.params;

    const sql = 'DELETE FROM pets WHERE petId = ?';

    db.run(sql, [petId], function (err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "Pet removed successfully" });
    });
  } catch (error) {
    console.error('Error removing pet:', error);
    res.status(500).json({ "error": "An error occurred while removing the pet" });
  }
});

// GET BOOKINGS ROUTE

app.get('/bookings/:userid', (req, res) => {
  const { userid } = req.params;
  const sql = `
    SELECT *
    FROM bookings AS b
    LEFT OUTER JOIN pets AS p ON b.petId = p.petId
    LEFT OUTER JOIN users AS u ON b.ownerId = u.id
    WHERE b.minderID = ? AND b.status != 'denied';`;

  db.all(sql, [userid], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// GET REVIEWS ROUTE

app.get('/review/:userid', (req, res) => {
  const { userid } = req.params;
  const sql = `
    SELECT r.*, u.username
    FROM reviews AS r
    LEFT OUTER JOIN users AS u on r.authorID = u.id
    WHERE r.subjectID =?`;

  db.all(sql, [userid], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// REQUEST BOOKING ROUTE

app.post('/BookMinder', (req, res) => {
  try {
    const { ownerId, minderId, petId, date, time, duration } = req.body
    let dateTime = `${date} ${time}`;
    const status = "pending";

    const sql = `INSERT INTO bookings (ownerId, minderId, petId, dateTime, durationMins, status) VALUES (?, ?, ?, ?, ?, ?)`
    db.run(sql, [ownerId, minderId, petId, dateTime, duration, status], function (err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
      });
    })
  } catch (error) {
    console.error('error:', error)
    res.status(500).json({ 'error': 'an error occured when trying to request booking' })
  }
})

// VIEW PROFILE ROUTE

app.get('/ViewProfile/:userId', (req, res) => {
  const { userId } = req.params;

  // the sql statement
  const sql = `
    SELECT username, email, phoneNumber, firstName, lastName, biography, accountStatus, role
    FROM users
    WHERE id = ?
  `;

  // execute the sql statement and return it back to the page
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});


// UPDATE SERVICES ROUTE 
app.post('/minderStatus', (req, res) => {
  try {
    const { minderId, city, dog, cat, rabbit, exotic, dogWalking, petSitting, grooming } = req.body;
    const active = 'true';

    // Check if a record with the given minderId already exists
    const checkSql = `SELECT * FROM minderStatus WHERE minderId = ?`;
    db.get(checkSql, [minderId], (err, row) => {
      if (err) {
        res.status(500).json({ "error": err.message });
        return;
      }

      // If a record with the given minderId already exists, update it
      if (row) {
        const updateSql = `
          UPDATE minderStatus 
          SET active = ?, city = ?, dog = ?, cat = ?, rabbit = ?, exotic = ?, dogWalking = ?, petSitting = ?, grooming = ?
          WHERE minderId = ?`;
        db.run(updateSql, [active, city, dog, cat, rabbit, exotic, dogWalking, petSitting, grooming, minderId], function (err) {
          if (err) {
            res.status(400).json({ "error": err.message });
            return;
          }
          res.json({ "message": "success" });
        });
      } else {

        // If no record exists, insert a new one
        const insertSql = `
          INSERT INTO minderStatus (minderId, active, city, dog, cat, rabbit, exotic, dogWalking, petSitting, grooming) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(insertSql, [minderId, active, city, dog, cat, rabbit, exotic, dogWalking, petSitting, grooming], function (err) {
          if (err) {
            res.status(400).json({ "error": err.message });
            return;
          }
          res.json({ "message": "success" });
        });
      }
    });
  } catch (error) {
    console.error('error:', error)
    res.status(500).json({ 'error': 'an error occurred when updating services.' })
  }
});


//GET STATUS ROUTE
app.get('/minderStatus/:userid', (req, res) => {
  const { userid } = req.params;
  const sql = `
    SELECT 
      city,
      CASE WHEN dog = 'true' THEN 'Dog' ELSE NULL END AS dog,
      CASE WHEN cat = 'true' THEN 'Cat' ELSE NULL END AS cat,
      CASE WHEN rabbit = 'true' THEN 'Rabbit' ELSE NULL END AS rabbit,
      CASE WHEN exotic = 'true' THEN 'Exotic' ELSE NULL END AS exotic,
      CASE WHEN dogWalking = 'true' THEN 'Dog Walking' ELSE NULL END AS dogWalking,
      CASE WHEN petSitting = 'true' THEN 'Pet Sitting' ELSE NULL END AS petSitting, 
      CASE WHEN grooming = 'true' THEN 'Grooming' ELSE NULL END AS grooming
    FROM minderStatus 
    WHERE minderId = ?`;

  db.all(sql, [userid], (err, rows) => {
    if (err) {
      console.error('Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    // Filter out NULL values
    const filteredRows = rows.map(row => {
      const filteredRow = {};
      for (const [key, value] of Object.entries(row)) {
        if (value !== null) {
          filteredRow[key] = value;
        }
      }
      return filteredRow;
    });

    res.json(filteredRows);
  });
});

// POST REVIEW ROUTE
app.post('/submitReview', async (req, res) => {
  try {
    const { minderId, authorId, reviewText, rating } = req.body;

    const sql = `INSERT INTO reviews (minderId, authorId, text, rating) VALUES (?, ?, ?, ?)`;
    db.run(sql, [minderId, authorId, reviewText, rating], function (err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "Review submitted successfully",
        "data": { id: this.lastID }
      });
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ "error": "An error occurred while submitting the review" });
  }
});

// GET REPORTS ROUTE
app.get('/GetReports', (req, res) => {
  const sql = `
      SELECT 
          r.reportId, 
          r.reportDetails, 
          au.id AS authorId,
          au.firstName AS authorFirstName, 
          au.lastName AS authorLastName, 
          su.id AS subjectId,
          su.firstName AS subjectFirstName, 
          su.lastName AS subjectLastName 
      FROM reports r
      JOIN users au ON r.authorId = au.id
      JOIN users su ON r.subjectId = su.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      reports: rows
    });
  });
});

//ACCEPT/DENY BOOKING ROUTE
app.post('/bookings', (req, res) => {
  try {
    const { bookingId, minderId, status } = req.body;
    const updateSql = `
      UPDATE bookings 
      SET status = ?
      WHERE bookingId = ? AND minderId = ?`;
    db.run(updateSql, [status, bookingId, minderId], function (err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "success" });
    });
  } catch (error) {
    console.error('error:', error);
    res.status(500).json({ 'error': 'an error occurred when updating booking.' });
  }
});

// GET PENDING MINDERS ROUTE
app.get('/GetPendingMinders', (req, res) => {
  const sql = `
    SELECT id, email, firstName, lastName
    FROM users
    WHERE role = 'minder' AND accountStatus = 'pending'
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      pendingMinders: rows
    });
  });
});

// ACCEPT OR DENY MINDER ROUTE

app.post('/UserDecision/:id', (req, res) => {
  const { id } = req.params; 
  const { decision } = req.body; 

  if (!['approved', 'pending', 'rejected', 'banned'].includes(decision)) {
      res.status(400).json({ error: 'Invalid decision value' });
      return;
  }

  const sql = `UPDATE users SET accountStatus = ? WHERE id = ?`;

  db.run(sql, [decision, id], function(err) {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      if (this.changes === 0) {
          res.status(404).json({ error: "User not found" });
      } else {
          res.json({ message: 'User status updated successfully', changes: this.changes });
      }
  });
});

// GET ALL USERS (MODERATOR)

app.get('/GetUsers', (req, res) => {
  const sql = `
      SELECT id, username, firstName, lastName, email, accountStatus, role 
      FROM users
  `;

  db.all(sql, [], (err, rows) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json({
          users: rows
      });
  });
});