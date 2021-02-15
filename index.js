const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table')

let departmentNames;
let managerNames;
let employeeNames;
let roleNames;

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port, if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: 'Paradox911',
    database: 'company_info',
  });


const OPTIONS = [
    { name: 'View All Employees', value: 1 },
    { name: 'View All Employees By Department', value: 2 },
    { name: 'View All Employees By Manager', value: 3 },
    { name: 'Add Employee', value: 4 },
    { name: 'Remove Employee', value: 5 },
    { name: 'Update Employee Role', value: 6 },
    { name: 'Update Employee Manager', value: 7 },
    { name: 'View All Roles', value: 8 },
    { name: 'Add Role', value: 9 },
    { name: 'Remove Role', value: 10 },
    { name: 'View All Departments', value: 11 },
    { name: 'View A Departments Budget', value: 12 },
    { name: 'Add Department', value: 13},
    { name: 'Remove Department', value: 14 },
  ];

const starterQuestion =  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'option',
    choices: OPTIONS,
    }

connection.connect();
inquirer
    .prompt([starterQuestion])
    .then(({ option }) => {
        console.log(option)
    switch (option) {
      case 1:
        displayEmployeesByAll();
        break;
      case 2:
        displayEmployeesByDepartment();
        break;
      case 3:
        displayEmployeesByManager();
        break;
      case 4:
        displayAddedEmployee();
        break;
      case 5:
        displayDeletedEmployee();
        break;
      case 6:
        displayUpdatedRole();
        break;
      case 7:
        displayUpdatedManager();
        break
      case 8:
        displayAllRoles();
        break
      case 9:
        displayAddedRole();
        break
      case 10:
        displayDeletedRole();
        break
      case 11: 
        displayAllDepartments();
        break;
      case 12:
        displayDepartmentBudget();
        break;
      case 13: 
        displayAddedDepartment();
        break;
      case 14:
        displayDeletedDepartment();
        break; 

        
        
        
        default:
        throw 'Something went wrong.';
    };
    
    });

//Query to fetch the employee data to display by department, manager and all
function queryEmployees(filter = {}) {
  return new Promise((resolve, reject) => {

    const filterQuery = Object.keys(filter)
                              .map(field => `AND ${field} = ? `)
                              .join('');

    connection.query(
      `
      SELECT e.id 'ID', CONCAT(e.first_name, ' ' , e.last_name) AS 'Name', role.title 'Title', department.name 'Department', role.salary 'Salary',
      CONCAT(m.first_name, ' ' , m.last_name) AS 'Manager' 
      FROM role, department, employees e
      LEFT JOIN employees m 
      ON (e.manager_id = m.id) 
      WHERE e.role_id = role.id AND role.department_id = department.id ${filterQuery};
      `,
      Object.values(filter)
      ,
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res)
        
        connection.end();
      }); 
  })
}    
   
//CASE 1: Code to display employees by All
const displayEmployeesByAll = () => {
  queryEmployees()
  .then((results) =>{ 
    const result = results;

    console.log(result)
                   
    const table = cTable.getTable(result)
    console.log(table)

  })

}

//CASE 2 : Helper code to display all Employees by department

const displayEmployeesByDepartment = () => {
  getDepartments()
  .then(departments => {
    console.log(departments)
    askDepartmentName(departments)
    .then(( { departmentID } ) => {
    queryEmployeesByDepartment(departmentID)
    
  });
  });
   
}

const getDepartments  = () => {
  return new Promise((resolve, reject) => {
          connection.query(
            `SELECT name, id FROM department`,
            (err, res) => {
              if (err) {
                reject(err);
              }
              
            departmentNames = res.map(department => {
              return {name: department.name, value: department.id }});
            console.log(departmentNames)
            resolve(departmentNames)
            });
      
  });
}

const askDepartmentName = (options) => {
   return inquirer
        .prompt([{
            type: 'list',
            message: 'Which department would you like?',
            name: 'departmentID',
            choices: options,
            }])
        
}

const queryEmployeesByDepartment = (departments) => {
  queryEmployees({
    'department.id': departments
  })
    .then((results) =>{ 
      const result = results;
      console.log(departments)
    //   const table = cTable.getTable(res)
      console.log(result)
                     
      const table = cTable.getTable(result)
      console.log(table)

    })
}

//CASE 3: Helper code to display all Employees by manager 
const displayEmployeesByManager = () => {
  getManagers()
  .then(managers => {
    console.log(managers)
    askManagerName(managers)
    .then(( { managers } ) => {

      queryEmployeesByManager(managers)
    
  });
  });
   
}

const getManagers  = () => {
  return new Promise((resolve, reject) => {
          connection.query(
            `SELECT distinct m.id, CONCAT(m.first_name, ' ' , m.last_name) AS 'Manager' 
            from employees e
            JOIN employees m 
            ON (e.manager_id = m.id)`,
            (err, res) => {
              if (err) {
                
                reject(err);
              
              }
              
            managerNames = res.map(employee => {
              return {name: employee.Manager, value: employee.id }});
            
            console.log(managerNames)
            resolve(managerNames)
            });      
  });
}

const askManagerName = (options) => {
  return inquirer
       .prompt([{
           type: 'list',
           message: 'Which manager would you like?',
           name: 'managers',
           choices: options,
           }])
       
}

const queryEmployeesByManager = (id) => {
  queryEmployees({
    'e.manager_id': id
  })
    .then((results) =>{ 
      const result = results;
      console.log(id)
   
      console.log(result)
                     
      const table = cTable.getTable(result)
      console.log(table)

    })
}

//Fetching the list of all employees 
const getEmployees  = () => {
  return new Promise((resolve, reject) => {
              

          connection.query(
            `SELECT distinct employees.id, CONCAT(employees.first_name, ' ' , employees.last_name) AS 'Name' 
            from employees`,
            (err, res) => {
              if (err) {
                
                reject(err);
              
              }
              
            employeeNames = res.map(employee => {
              return {name: employee.Name, value: employee.id }});
            employeeNames.unshift({name: "None", value: null});
            console.log(employeeNames)
            resolve(employeeNames)
            });      
  });
}

//Fetching the list of all roles
const getRoles  = () => {
  return new Promise((resolve, reject) => {
              

          connection.query(
            `SELECT distinct role.id, role.title from role`,
            (err, res) => {
              if (err) {
                
                reject(err);
              
              }
              
            roleNames = res.map(role => {
              return {name: role.title, value: role.id }});
            console.log(roleNames)
            resolve(roleNames)
            });      
  });
}

//CASE 4: Code to add a new employee
const askEmployeeInfo = (roles, managers) => {
  return inquirer
       .prompt([{
           type: 'input',
           message: 'What is the employees first name?',
           name: 'firstName',
           }, 
          {
            type: 'input',
            message: 'What is the employees last name?',
            name: 'lastName',
          }, 
          {
            type: 'list',
            message: 'What is the employees role?',
            name: 'role',
            choices: roles,
          },
          {
            type: 'list',
            message: 'Please choose a manager for the employee?',
            name: 'manager',
            choices: managers,
          }

          ])
}

const addEmployee = (firstName, lastName, role, manager) => {

  connection.query(
    'INSERT INTO employees SET ?',
    [
      {
        first_name: firstName,
        last_name: lastName,
        role_id: role,
        manager_id: manager
      },
    ],
      (err, res) => {
        if (err) {
          throw err;
        }

        console.log(`Succesfully added new employee Name: ${firstName} ${lastName}, Role: ${role}, Manager: ${manager}`)
                       
        connection.end();
      }); 
}
 
const displayAddedEmployee = () => {
  getEmployees()
  .then(employees => {
    console.log(employees)
    getRoles()
    .then(roles => {
      console.log(roles)
      askEmployeeInfo(roles, employees)
      .then(({firstName, lastName, role, manager} ) => {

        addEmployee(firstName, lastName, role, manager)
    
      });
    });
  });
}

// CASE 5: Code to delete an employee
const askEmployeeName = (options) => {
  return inquirer
  .prompt([{
      type: 'list',
      message: 'Which employee would you like to select?',
      name: 'employeeID',
      choices: options,
      }])

}

const deleteEmployee = (id) => {

  connection.query(
    `DELETE FROM employees WHERE employees.id = ${id};`,
    (err, res) => {
      if (err) {
        throw err;
      }


      console.log(`Succesfully deleted employee id: ${id}`)
                      
      
      connection.end();
    }); 
}

const displayDeletedEmployee = () => {
  getEmployees()
  .then(employees => {
    console.log(employees)
    askEmployeeName(employees)
      .then(({employeeID} ) => {

        deleteEmployee(employeeID)
    
      });
    
  });
}

//CASE 6: Code to update an employees role in the company
const askRoleName = (options) => {
  return inquirer
  .prompt([{
      type: 'list',
      message: 'Which role would you like to select?',
      name: 'roleID',
      choices: options,
      }])

}

const updateRoleID = (id, roleID) => {

  connection.query(
    `UPDATE employees 
      SET 
        role_id = ${roleID}
      WHERE
        id = ${id};`,
    (err, res) => {
      if (err) {
        throw err;
      }
      


      console.log(`Succesfully updated employee ${id} role to ${roleID}`)
                      

      
      connection.end();
    }); 
}

const displayUpdatedRole = () => {
  getEmployees()
  .then(employees => {
    console.log(employees)
    getRoles()
    .then(roles => {
      console.log(roles)
    askEmployeeName(employees)
      .then(({employeeID} ) => {
        askRoleName(roles)
        .then( ({roleID}) => {
          updateRoleID(employeeID, roleID )
        });
      });
    }); 
  });
}

//CASE 7: Code to update the employees manager to a new manager
const updateManagerID = (id, managerID) => {

  connection.query(
    `UPDATE employees 
      SET 
        manager_id = ?
      WHERE
        id = ?;`,
        [managerID, id],
    (err, res) => {
      if (err) {
        throw err;
      }
      


      console.log(`Succesfully updated employee ${id} manager to ${managerID}`)
                      

      
      connection.end();
    }); 
}

const askManagerUpdate = (options) => {
  return inquirer
  .prompt([{
      type: 'list',
      message: 'Which employee would you like to become the manager?',
      name: 'managerID',
      choices: options,
      }])

}
const displayUpdatedManager = () => {
  getEmployees()
  .then(employees => {
    console.log(employees)
    getEmployees()
    .then(managers => {
      console.log(managers)
    askEmployeeName(employees)
      .then(({employeeID} ) => {
        askManagerUpdate(managers)
        .then( ({managerID}) => {
          updateManagerID(employeeID, managerID )
        });
      });
    }); 
  });
}

//CASE 8: Code to view all the roles
const displayAllRoles = () => {

  
  connection.query(
    `SELECT distinct role.id 'ID', role.title 'Title', department.name 'Department' from role, department 
    WHERE role.department_id = department.id`,
    (err, res) => {
      if (err) {
        throw(err);
      }
      const result = res;

    //   const table = cTable.getTable(res)
      console.log(res)
                     
      const table = cTable.getTable(result)
      console.log(table)

    });  

}

//CASE 9: Code to add new roles 
const addRole = (title, salary, department) => {

  connection.query(
    'INSERT INTO role SET ?',
    [
      {
        title: title,
        salary: salary,
        department_id: department,
      },
    ],
      (err, res) => {
        if (err) {
          throw err;
        }

        console.log(`Succesfully added new role - Title: ${title} , Salary: ${salary}, Department ID: ${department}`)
                       
        connection.end();
      }); 
}

const askRoleInfo = (department) => {
  return inquirer
       .prompt([{
           type: 'input',
           message: 'What is the title of the role?',
           name: 'title',
           }, 
          {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'salary',
          }, 
          {
            type: 'list',
            message: 'What department does the role belong?',
            name: 'department',
            choices: department,
          },

          ])
}



const displayAddedRole = () => {
  getDepartments()
  .then(departments => {
    console.log(departments)
      askRoleInfo(departments)
      .then(({title, salary, department} ) => {
        addRole(title, salary, department)

    
      });

  });
}

//CASE10: Code to delete a role 
const deleteRole = (id) => {

  connection.query(
    `DELETE FROM role WHERE role.id = ?;`,
    [id],
    (err, res) => {
      if (err) {
        console.log('Please delete all employees associated with the role prior to deleting')
        // throw err;
      }
      else {
        console.log(`Succesfully deleted role id: ${id}`)
      }
                      
      
      connection.end();
    }); 
}

const displayDeletedRole = () => {
  getRoles()
  .then(roles => {
    console.log(roles)
    askRoleName(roles)
      .then(({roleID} ) => {

        deleteRole(roleID)
    
      });
    
  });
}

//CASE11: Code to display all the departments
const displayAllDepartments = () => {

  
  connection.query(
    `SELECT distinct department.id 'ID', department.name 'Name' from department `
    ,
    (err, res) => {
      if (err) {
        throw(err);
      }
      const result = res;

    //   const table = cTable.getTable(res)
      console.log(res)
                     
      const table = cTable.getTable(result)
      console.log(table)

    });  

}

//CASE 12: Code to view departments budgets
const displayDepartmentsBudget = (department) => {

  
  connection.query(
    `SELECT department.id, department.name, SUM(CASE WHEN employees.id IS NOT NULL THEN role.salary ELSE 0 END) as 'Budget'
    FROM  department
    left JOIN role
    on (role.department_id = department.id)
    left join employees
    on (role.id = employees.role_id)
    where department.id = ?
    group by department.id;`,
    [department],
    (err, res) => {
      if (err) {
        throw(err);
      }
      const result = res;

    //   const table = cTable.getTable(res)
      console.log(res)
                     
      const table = cTable.getTable(result)
      console.log(table)

    });  

}

const displayDepartmentBudget = () => {
  getDepartments()
  .then(departments => {
    console.log(departments)
    askDepartmentName(departments)
    .then(( { departmentID } ) => {
      displayDepartmentsBudget(departmentID)
    
  });
  });

}


// CASE 13: Code below to add a new department
const askDepartmentInput = () => {
  return inquirer
       .prompt([{
           type: 'input',
           message: 'What is the name of the new department?',
           name: 'departmentName',
           }, 

          ])
}

const addDepartment = (departmentName) => {

  connection.query(
    'INSERT INTO department SET ?',
    [
      {
        name: departmentName,

      },
    ],
      (err, res) => {
        if (err) {
          throw err;
        }

        console.log(`Succesfully added new employee Name: ${departmentName}`)
                       
        connection.end();
      }); 
}
 
const displayAddedDepartment = () => {

  askDepartmentInput()
      .then(({departmentName} ) => {

        addDepartment(departmentName)
    
      });

}

//CASE 14:Code to delete a department 
const deleteDepartment = (id) => {

  connection.query(
    `DELETE FROM department WHERE department.id = ?;`,
    [id],
    (err, res) => {
      if (err) {

        console.log('Please delete all roles associated with the department prior to deleting')
        // throw err;
      }
      else {
        console.log(`Succesfully deleted department id: ${id}`)
      }
                      
      
      connection.end();
    }); 
}

const displayDeletedDepartment = () => {
  getDepartments()
  .then(departments => {
    console.log(departments)
    askDepartmentName(departments)
      .then(({departmentID} ) => {

        deleteDepartment(departmentID)
    
      });
    
  });
}



// module.exports ={
//   displayAllRoles: displayAllRoles
// }
//require('queries.js')
//require('questions.js')