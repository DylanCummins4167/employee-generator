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

// Function to view all employees
function viewAllEmployees(db) {
  db.all(`
    SELECT employees.id, first_name, last_name, title, departments.name AS department, salary, 
    (SELECT CONCAT(manager.first_name, ' ', manager.last_name) FROM employees AS manager WHERE manager.id = employees.manager_id) AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
  `, [], (err, rows) => {
    console.log("Employees:");
    rows.forEach(row => {
      console.log(`ID: ${row.id}, Name: ${row.first_name} ${row.last_name}, Role: ${row.title}, Department: ${row.department}, Salary: ${row.salary}, Manager: ${row.manager}`);
    });
  });
}

// Function to add a department
function addDepartment(db, departmentName) {
  db.run('INSERT INTO departments (name) VALUES (?)', [departmentName]);
}

// Function to add a role
function addRole(db, title, salary, departmentId) {
  db.run('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
}

// Function to add an employee
function addEmployee(db, firstName, lastName, roleId, managerId) {
  db.run('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
}

// Function to update an employee role
function updateEmployeeRole(db, employeeId, newRoleId) {
  db.run('UPDATE employees SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
}

// Function to display the menu
function showMenu() {
  console.log("\nOptions:");
  console.log("1. View all departments");
  console.log("2. View all roles");
  console.log("3. View all employees");
  console.log("4. Add a department");
  console.log("5. Add a role");
  console.log("6. Add an employee");
  console.log("7. Update an employee role");
  console.log("8. Exit");
}

// Main function to handle user input and actions
function main() {
  const db = new sqlite3.Database('employee_database.db');

  createTables(db);
 const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

 rl.on('line', input => {
    switch (input) {
      case '1':
        viewAllDepartments(db);
        break;
      case '2':
        viewAllRoles(db);
        break;
      case '3':
        viewAllEmployees(db);
        break;
      case '4':
        rl.question("Enter the name of the department: ", departmentName => {
          addDepartment(db, departmentName);
          console.log("Department added successfully!");
        });
        break;
 case '5':
        rl.question("Enter the title of the role: ", title => {
          rl.question("Enter the salary for the role: ", salary => {
            rl.question("Enter the department id for the role: ", departmentId => {
              addRole(db, title, parseFloat(salary), parseInt(departmentId));
              console.log("Role added successfully!");
            });
          });
        });
 break;
      case '6':
        rl.question("Enter the employee's first name: ", firstName => {
          rl.question("Enter the employee's last name: ", lastName => {
            rl.question("Enter the role id for the employee: ", roleId => {
              rl.question("Enter the manager id for the employee (0 if no manager): ", managerId => {
                addEmployee(db, firstName, lastName, parseInt(roleId), parseInt(managerId));
                console.log("Employee added successfully!");
              });
            });
          });
        });
break;
      case '7':
        rl.question("Enter the id of the employee to update: ", employeeId => {
          rl.question("Enter the new role id for the employee: ", newRoleId => {
            updateEmployeeRole(db, parseInt(employeeId), parseInt(newRoleId));
            console.log("Employee role updated successfully!");
          });
        });
 break;
      case '8':
        rl.close();
        db.close();
        console.log("Exiting the application.");
        break;
      default:
        console.log("Invalid option. Please try again.");
    }

        showMenu();
  });

  showMenu();
}

main();

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


