const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  // Finds all employees, then joins their roles and departments. It will display their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  // Finds all employees by their department. Joins employee with the role and title
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
      departmentId
    );
  }

  // Finds all employees by their manager. Joins them with the depart and roles to display their title and department name
  findAllEmployeesByManager(managerId) {
    return this.connection.promise().query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
      managerId
    );
  }

  // Creates a new employee
  createEmployee(employee) {
    return this.connection.promise().query(
        "INSERT INTO employee SET ?",
        employee
    );
  }

  // Removes an employee
  removeEmployee(employeeId) {
    return this.connection.promise().query(
        "DELETE FROM employee WHERE id = ?",
        employeeId
    );
  }

  // Updates an employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }

  // Updates an employee's manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }
  
//   {
//     name: "View All Roles",
//     value: "VIEW_ROLES"
//   },
//   {
//     name: "Add Role",
//     value: "ADD_ROLE"
//   },
//   {
//     name: "Remove Role",
//     value: "REMOVE_ROLE"
//   },
//   {
//     name: "View All Departments",
//     value: "VIEW_DEPARTMENTS"
//   },
//   {
//     name: "Add Department",
//     value: "ADD_DEPARTMENT"
//   },
//   {
//     name: "Remove Department",
//     value: "REMOVE_DEPARTMENT"
//   },
//   {
//     name: "View Total Utilized Budget By Department",
//     value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
//   },


}

module.exports = new DB(connection);