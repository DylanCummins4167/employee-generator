const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

// Function to create tables if they don't exist
function createTables(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY,
      name TEXT
    )
  `);
