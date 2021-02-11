const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table')

let departmentNames;
let managerNames;

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
    //   case 4:
    //     askSongTitle().then(queryByTitle);
    //     break;
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

getManagers()

const askManagerName = (options) => {
  return inquirer
       .prompt([{
           type: 'list',
           message: 'Which department would you like?',
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
      WHERE e.role_id = role.id AND role.department_id = department.id AND e.manager_id = ${id};
      `,
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
