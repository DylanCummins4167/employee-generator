const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

// Create a database connection
const db = new sqlite3.Database('employee_database.db');

// Create the necessary tables if they don't exist
function createTables() {
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

// Function to display all departments
function viewAllDepartments() {
  db.all('SELECT * FROM departments', (err, rows) => {
    if (err) {
      console.error('Error retrieving departments:', err);
    } else {
      console.table(rows);
    }
    promptUser();
  });
}

// Function to display all roles
function viewAllRoles() {
  db.all('SELECT * FROM roles', (err, rows) => {
    if (err) {
      console.error('Error retrieving roles:', err);
    } else {
      console.table(rows);
    }
    promptUser();
  });
}

// Function to display all employees
function viewAllEmployees() {
  db.all('SELECT * FROM employees', (err, rows) => {
    if (err) {
      console.error('Error retrieving employees:', err);
    } else {
      console.table(rows);
    }
    promptUser();
  });
}

// Function to add a department
function addDepartment() {
  rl.question('Enter the name of the department: ', (name) => {
    db.run('INSERT INTO departments (name) VALUES (?)', [name], (err) => {
      if (err) {
        console.error('Error adding department:', err);
      } else {
        console.log('Department added successfully!');
      }
      promptUser();
    });
  });
}

// Function to add a role
function addRole() {
  rl.question('Enter the title of the role: ', (title) => {
    rl.question('Enter the salary for the role: ', (salary) => {
      rl.question('Enter the department ID for the role: ', (departmentId) => {
        db.run(
          'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
          [title, salary, departmentId],
          (err) => {
            if (err) {
              console.error('Error adding role:', err);
            } else {
              console.log('Role added successfully!');
            }
            promptUser();
          }
        );
      });
    });
  });
}

// Function to add an employee
function addEmployee() {
  rl.question('Enter the first name of the employee: ', (firstName) => {
    rl.question('Enter the last name of the employee: ', (lastName) => {
      rl.question('Enter the role ID for the employee: ', (roleId) => {
        rl.question('Enter the manager ID for the employee (or leave empty): ', (managerId) => {
          db.run(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [firstName, lastName, roleId, managerId || null],
            (err) => {
              if (err) {
                console.error('Error adding employee:', err);
              } else {
                console.log('Employee added successfully!');
              }
              promptUser();
            }
          );
        });
      });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  rl.question('Enter the ID of the employee to update: ', (employeeId) => {
    rl.question('Enter the new role ID for the employee: ', (roleId) => {
      db.run(
        'UPDATE employees SET role_id = ? WHERE id = ?',
        [roleId, employeeId],
        (err) => {
          if (err) {
            console.error('Error updating employee role:', err);
          } else {
            console.log('Employee role updated successfully!');
          }
          promptUser();
        }
      );
    });
  });
}

// Function to prompt the user for options
function promptUser() {
  console.log('\nOptions:');
  console.log('1. View all departments');
  console.log('2. View all roles');
  console.log('3. View all employees');
  console.log('4. Add a department');
  console.log('5. Add a role');
  console.log('6. Add an employee');
  console.log('7. Update an employee role');
  console.log('8. Exit');

  rl.question('Enter the option number: ', (option) => {
    switch (option) {
      case '1':
        viewAllDepartments();
        break;
      case '2':
        viewAllRoles();
        break;
      case '3':
        viewAllEmployees();
        break;
      case '4':
        addDepartment();
        break;
      case '5':
        addRole();
        break;
      case '6':
        addEmployee();
        break;
      case '7':
        updateEmployeeRole();
        break;
      case '8':
        db.close();
        console.log('Exiting application.');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        promptUser();
    }
  });
}

// Create the tables and start the application
createTables();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
promptUser();


