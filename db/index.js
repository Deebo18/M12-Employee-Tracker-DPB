const connection = require("./connections");

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

  // Finds all roles and joins with the department to display the departments name.
  findAllRoles() {
    return this.connection.promise().query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }
  
  // Creates a new role
  addRole(role) {
    return this.connection.promise().query(
        "INSERT Into role SET ?",
        role);
  }

  // Removes a role from db
  removeRole(roleId) {
    return this.connection.promise().query(
        "DELETE FROM role WHERE id ?",
        roleId);
  }

  // Finds all departments
  findAllDepartments() {
    return this.connection.promise().query(
        "SELECT department.id, department.name FROM department;");
  }

  // Adds a new department
  addDepartment(department) {
    return this.connection.promise().query(
        "INSERT Into department SET ?",
        department);
  }

  // Removes a department from db
  removeDepartment(departmentId) {
    return this.connection.promise().query(
        "DELETE FROM department WHERE id ?",
        departmentId);
  }

  // Finds all departments, joins employees and their roles and totals up the departments utilized budget
  viewDepartmentBudgets() {
    return this.connection.promise().query(
        "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;");
  }
}

module.exports = new DB(connection);