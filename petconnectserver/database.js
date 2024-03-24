const sqlite3 = require('sqlite3').verbose();

// Open a database file, or create it if it doesn't exist
let db = new sqlite3.Database('./petconnect.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});



module.exports = db;