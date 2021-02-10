const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table')

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
    name: 'options',
    choices: OPTIONS,
    }

    connection.connect();
    inquirer
      .prompt([starterQuestion])
      .then(({ option }) => {
        switch (option) {
          case 1:
            connection.query(
                `SELECT * FROM employees`,
                (err, res) => {
                  if (err) {
                    throw err;
                  }
                  cTable(res)
                  
                  connection.end();
                });
            break;
        //   case 2:
        //     showPopularArtists();
        //     break;
        //   case 3:
        //     askFromToYear().then(queryBetweenYears);
        //     break;
        //   case 4:
        //     askSongTitle().then(queryByTitle);
        //     break;
          default:
            throw 'Something went wrong.';
        };
        
      });