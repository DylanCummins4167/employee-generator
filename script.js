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

 db.run(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY,
      title TEXT,
      salary REAL,
      department_id INTEGER,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      role_id INTEGER,
      manager_id INTEGER,
      FOREIGN KEY (role_id) REFERENCES roles(id),
      FOREIGN KEY (manager_id) REFERENCES employees(id)
    )
  `);
}

// Function to view all departments
function viewAllDepartments(db) {
  db.all('SELECT id, name FROM departments', [], (err, rows) => {
    console.log("Departments:");
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.name}`);
    });
  });
}

// Function to view all roles
function viewAllRoles(db) {
  db.all(`
    SELECT roles.id, title, salary, departments.name AS department
    FROM roles JOIN departments ON roles.department_id = departments.id
  `, [], (err, rows) => {
    console.log("Roles:");
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Title: ${row.title}, Salary: ${row.salary}, Department: ${row.department}`);
    });
  });
}
