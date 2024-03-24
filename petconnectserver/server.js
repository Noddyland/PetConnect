const express = require('express');
const db = require('./database.js');
const app = express();
const port = 5000;

app.use(express.json()); // for parsing application/json

// Route to get all users
app.get('/users', (req, res) => {
  const sql = "SELECT * FROM users";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

// Route to add a new user
app.post('/users', (req, res) => {
  const { username, password, email, phoneNumber, firstName, lastName, biography} = req.body;
  const accountStatus = "approved";
  const sql = 'INSERT INTO users (username, password, email, phoneNumber, firstName, lastName, biography, accountStatus) VALUES (?,?,?,?,?,?,?,?)';
  db.run(sql, [username, password, email, phoneNumber, firstName, lastName, biography, accountStatus], function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json({
      "message": "success",
      "data": { id: this.lastID }
    });
  });
});

// Example Express.js route for authentication
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Find user by username
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).send('Username or password is incorrect');
    }
    // Verify password (assuming 'user.password' is hashed)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Username or password is incorrect');
    }
    // Generate and return token (e.g., JWT)
    const token = generateToken(user.id);
    res.json({ token });
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});