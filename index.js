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
        queryEmployeesByAll();
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
        
        
        default:
        throw 'Something went wrong.';
    };
    
    });

   
//Code to fetch employees by All
const queryEmployeesByAll = () => {
    connection.query(
        `
        SELECT e.id 'ID', CONCAT(e.first_name, ' ' , e.last_name) AS 'Name', role.title 'Title', department.name 'Department', role.salary 'Salary',
        CONCAT(m.first_name, ' ' , m.last_name) AS 'Manager' 
        FROM role, department, employees e
        LEFT JOIN employees m 
        ON (e.manager_id = m.id) 
        WHERE e.role_id = role.id AND role.department_id = department.id;
        `,
        (err, res) => {
          if (err) {
            throw err;
          }
          const result = res;
        //   const table = cTable.getTable(res)
          console.log(res)
                         
          const table = cTable.getTable(result)
          console.log(table)
          
          connection.end();
        });

}

//Helper code to get Employees by department

const displayEmployeesByDepartment = () => {
  getDepartments()
  .then(departments => {
    console.log(departments)
    askDepartmentName(departments)
    .then(( response ) => {
    queryEmployeesByDepartment(response.departments)
    
  });
  });
   
}

const getDepartments  = () => {
  return new Promise((resolve, reject) => {
              

          connection.query(
            `SELECT name FROM department`,
            (err, res) => {
              if (err) {
                
                reject(err);
              
              }
              
            departmentNames = res.map(department => department.name);
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
            name: 'departments',
            choices: options,
            }])
        
}



const queryEmployeesByDepartment = (departments) => {

            connection.query(
                `
                SELECT e.id 'ID', CONCAT(e.first_name, ' ' , e.last_name) AS 'Name', role.title 'Title', department.name 'Department', role.salary 'Salary',
                CONCAT(m.first_name, ' ' , m.last_name) AS 'Manager' 
                FROM role, department, employees e
                LEFT JOIN employees m 
                ON (e.manager_id = m.id) 
                WHERE e.role_id = role.id AND role.department_id = department.id AND department.name = '${departments}';
                `,
                (err, res) => {
                  if (err) {
                    throw err;
                  }
                  const result = res;
                  console.log(departments)
                //   const table = cTable.getTable(res)
                  console.log(res)
                                 
                  const table = cTable.getTable(result)
                  console.log(table)
                  
                  connection.end();
                }); 
}

//Helper code to fetch Employees by manager 
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


//Have to fetch employee list by manager ID's
const queryEmployeesByManager = (id) => {

  connection.query(
      `
      SELECT e.id 'ID', CONCAT(e.first_name, ' ' , e.last_name) AS 'Name', role.title 'Title', department.name 'Department', role.salary 'Salary',
      CONCAT(m.first_name, ' ' , m.last_name) AS 'Manager' 
      FROM role, department, employees e
      LEFT JOIN employees m 
      ON (e.manager_id = m.id) 
      WHERE e.role_id = role.id AND role.department_id = department.id AND e.manager_id = ?;
      `,
      [id],
      (err, res) => {
        if (err) {
          throw err;
        }
        const result = res;
        console.log(id)
      //   const table = cTable.getTable(res)
        console.log(res)
                       
        const table = cTable.getTable(result)
        console.log(table)
        
        connection.end();
      }); 
}

//Adding and removing and employee
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

const askNewRole = (options) => {
  return inquirer
  .prompt([{
      type: 'list',
      message: 'Which role would you like to assign to the employee?',
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
        askNewRole(roles)
        .then( ({roleID}) => {
          updateRoleID(employeeID, roleID )
        });
      });
    }); 
  });
}

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

// module.exports ={
//   displayAllRoles: displayAllRoles
// }
//require('queries.js')
//require('questions.js')