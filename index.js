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
            viewEmployeesByManager();
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
          value: id
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
function viewEmployeesByManager() {
  db.findAllEmployees()
    .then(([rows]) => {
      let managers = rows;
      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "managerId",
          message: "Which employee do you want to see direct reports for?",
          choices: managerChoices
        }
      ])
        .then(res => db.findAllEmployeesByManager(res.managerId))
        .then(([rows]) => {
          let employees = rows;
          console.log("\n");
          if (employees.length === 0) {
            console.log("The selected employee has no direct reports");
          } else {
            console.table(employees);
          }
        })
        .then(() => loadMainPrompts())
    });
}

// Function to remove an emplyee
function removeEmployee() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt([
            {
              type: "list",
              name: "employeeId",
              message: "Which employee do you want to remove?",
              choices: employeeChoices
            }
          ])
            .then(res => db.removeEmployee(res.employeeId))
            .then(() => console.log("Employee removed from database"))
            .then(() => loadMainPrompts())  
        })
};

// Function to update an employees role
function updateEmployeeRole() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          let employeeId = res.employeeId;
          db.findAllRoles()
            .then(([rows]) => {
              let roles = rows;
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role do you want to assign the selected employee?",
                  choices: roleChoices
                }
              ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("Updated employee's role"))
                .then(() => loadMainPrompts())
            });
        });
    })
}

 // Function to update an employees manager
 function updateEmployeeManager() {
  db.findAllEmployees()
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's manager do you want to update?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          let employeeId = res.employeeId
          db.findAllPossibleManagers(employeeId)
            .then(([rows]) => {
              let managers = rows;
              const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }));

              prompt([
                {
                  type: "list",
                  name: "managerId",
                  message:
                    "Which employee do you want to set as manager for the selected employee?",
                  choices: managerChoices
                }
              ])
                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                .then(() => console.log("Updated employee's manager"))
                .then(() => loadMainPrompts())
            })
        })
    })
}

// Function to view all employee roles
function viewAllRoles() {
    db.findAllRoles()
      .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
      })
      .then(() => loadMainPrompts());
}

// Function to add an employee role
function addRole() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name}) => ({
          name: name,
          value: id
        }));

        prompt([
          {
            name: "title",
            message: "What is the name of the role?"
          },
          {
            name: "salary",
            message: "What is the salary for the role?"
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
          }
        ])
          .then(() => {
            db.createRole(role)
            .then(() => console.log(`Added ${role.title} to the database`))
            .then(() => loadMainPrompts())
        })
    })
}

// Function to delete an employees role
function removeRole() {
  db.findAllRoles()
    .then(([rows]) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      prompt([
        {
          type: "list",
          name: "roleId",
          message:
            "Which role do you want to remove? (Warning: This will also remove employees)",
          choices: roleChoices
        }
      ])
        .then(res => db.removeRole(res.roleId))
        .then(() => console.log("Removed role from the database"))
        .then(() => loadMainPrompts())
    })
}

// Function to view all department
function viewAllDepartments() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
      })
      .then(() => loadMainPrompts());
}

// Function to add a department
function addDepartment() {
    prompt([
        {
          name: "name",
          message: "What is the name of the department?"
        },
      ])
        .then(res => {
          let name = res;
        
          db.addDepartment(name)
            .then(() => console.log(`Added ${name.name} to the database`))
            .then(() => loadMainPrompts());
            })
}

// Function to delete a department
function removeDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id
        }));

        prompt({
            type: "list",
            name: "departmentId",
            message: "Which department would you like to remove?",
            choices: departmentChoices
          })
            .then(res => db.removeDepartment(res.departmentId))
            .then(() => console.log(`Removed department from the database`))
            .then(() => loadMainPrompts())
        })
}

// Function to view departments and show their total utilized department budget
function viewUtilizedBudgetByDepartment () {
    db.viewDepartmentBudgets()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
      })
      .then(() => loadMainPrompts());
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
        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
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

                  managerChoices.unshift({ name: "None", value: null });

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