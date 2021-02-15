const inquirer = require('inquirer');
const queries = require('./src/queries')

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

inquirer
    .prompt([starterQuestion])
    .then(({ option }) => {

      switch (option) {
        case 1:
          queries.displayEmployeesByAll();
          break;
        case 2:
          queries.displayEmployeesByDepartment();
          break;
        case 3:
          queries.displayEmployeesByManager();
          break;
        case 4:
          queries.displayAddedEmployee();
          break;
        case 5:
          queries.displayDeletedEmployee();
          break;
        case 6:
          queries.displayUpdatedRole();
          break;
        case 7:
          queries.displayUpdatedManager();
          break
        case 8:
          queries.displayAllRoles();
          break
        case 9:
          queries.displayAddedRole();
          break
        case 10:
          queries.displayDeletedRole();
          break
        case 11: 
          queries.displayAllDepartments();
          break;
        case 12:
          queries.displayDepartmentBudget();
          break;
        case 13: 
          queries.displayAddedDepartment();
          break;
        case 14:
          queries.displayDeletedDepartment();
          break; 
        default:
          throw 'Something went wrong.';
      };
    
});

