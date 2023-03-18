const { prompt } = require("inquirer");
const db = require("./db");
const cTable = require('console.table');
const logo = require('asciiart-logo');

init ();

// Function to initialize asciiart-logo
function init() {
    const employeeManager = logo({ 
        name: 'Employee Manager', 
        logoColor: 'white',
    })
    .render();

    console.log(employeeManager);
  
    loadMainPrompts();
}

// Loading the main prompts for initial selection. 
function loadMainPrompts() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                  name: "View All Employees",
                  value: "VIEW_EMPLOYEES"
                },
                {
                  name: "View All Employees By Department",
                  value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                  name: "View All Employees By Manager",
                  value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                  name: "Add Employee",
                  value: "ADD_EMPLOYEE"
                },
                {
                  name: "Remove Employee",
                  value: "REMOVE_EMPLOYEE"
                },
                {
                  name: "Update Employee Role",
                  value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                  name: "Update Employee Manager",
                  value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                  name: "View All Roles",
                  value: "VIEW_ROLES"
                },
                {
                  name: "Add Role",
                  value: "ADD_ROLE"
                },
                {
                  name: "Remove Role",
                  value: "REMOVE_ROLE"
                },
                {
                  name: "View All Departments",
                  value: "VIEW_DEPARTMENTS"
                },
                {
                  name: "Add Department",
                  value: "ADD_DEPARTMENT"
                },
                {
                  name: "Remove Department",
                  value: "REMOVE_DEPARTMENT"
                },
                {
                  name: "View Total Utilized Budget By Department",
                  value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
                },
                {
                  name: "Quit",
                  value: "QUIT"
                }
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        // Uses the corresponding function based on the users selection.
        switch (choice) {
          case "VIEW_EMPLOYEES":
            viewAllEmployees();
            break;
          case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            viewAllEmployeesByDepartment();
            break;
          case "VIEW_EMPLOYEES_BY_MANAGER":
            viewAllEmployeesByManager();
            break;
          case "ADD_EMPLOYEE":
            addEmployee();
            break;
          case "REMOVE_EMPLOYEE":
            removeEmployee();
            break;
          case "UPDATE_EMPLOYEE_ROLE":
            updateEmployeeRole();
            break;
          case "UPDATE_EMPLOYEE_MANAGER":
            updateEmployeeManager();
            break;
          case "VIEW_ROLES":
            viewAllRoles();
            break;
          case "ADD_ROLE":
            addRole();
            break;
          case "REMOVE_ROLE":
            removeRole();
            break;
          case "VIEW_DEPARTMENTS":
            viewAllDepartments();
            break;
          case "ADD_DEPARTMENT":
            addDepartment();
            break;
          case "REMOVE_DEPARTMENT":
            removeDepartment();
            break;
          case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
            viewUtilizedBudgetByDepartment();
            break;
          default:
            quit();
        }
      }
    )
}

// Function that views all employees
function viewAllEmployees() {
    db.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  }

// Function that views all employees that belong to a department
function viewAllEmployeesByDepartment() {
    db.findAllDepartments()
      .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id,
        }));
  
        prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Which department would you like to see employees for?",
            choices: departmentChoices
          }
        ])
          .then(res => db.findAllEmployeesByDepartment(res.departmentId))
          .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
          })
          .then(() => loadMainPrompts())
    });
}

// Function that views all employees that belong to a specific Manager
function viewAllEmployeesByManager() {
    db.findAllEmployeesByManager()
    .then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
        }));

        prompt([
            {
              type: "list",
              name: "managerId",
              message: "Which manager do you want to see direct reports for?",
              choices: managerChoices
            }
          ])
            .then(res => db.findAllEmployeesByManager(res.managerId))
            .then(([rows]) => {
              let employees = rows;
              console.log("\n");
              console.table(employees);
          })
          .then(() => loadMainPrompts())
    });
}

// Function to add an employee
function addEmployee() {
    prompt([
      {
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        message: "What is the employee's last name?"
      }
    ])
      .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;
      
        db.findAllRoles()
        .then(([rows]) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, name }) => ({
            name: name,
            value: id,
          }));

          prompt({
              type: "list",
              name: "roleId",
              message: "What is the employee's role?",
              choices: roleChoices
            })
            .then(res => {
                let roleId = res.roleId;

                db.findAllEmployees()
                .then(([rows]) => {
                  let employees = rows;
                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));

                  prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                  })
                    .then(res => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName
                      }
    
                      db.createEmployee(employee);
                    })
                    .then(() => console.log(
                      `Added ${firstName} ${lastName} to the database`
                    ))
                      .then(() => loadMainPrompts())
                    })
                })
            })
        })
}

function quit() {
    console.log("Goodbye!");
    process.exit();
}