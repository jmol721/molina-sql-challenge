const inquirer = require('inquirer');
const Database = require('./connection/connection');
const cTable = require('console.table');
const { async } = require('rxjs');


const database = new Database();

const questions = [
    {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 
        'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
    }
];

const init = async function() {
    return inquirer.prompt(questions)
    .then((answer) => {
        console.log(answer);
        const action = answer['action'];
        switch (action) {
            case 'View all departments':
                console.log("\n");
                handleViewAllDepartments();
                break;
            case 'View all roles':
                console.log("\n");
                handleViewAllRoles();
                init();
                break;
            case 'View all employees':
                console.log("\n");
                handleViewAllEmployees();
                init();
                break;
            case 'Add a department':
                console.log('Add a department');
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'departmentName',
                        message: 'What is the department name?'
                    }
                ]).then(function(answer) {
                    handleAddADepartment(answer.departmentName);
                    handleViewAllDepartments();
                })
                init;
                break;
            case 'Add a role':
                console.log('Add a role');
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'roleTitle',
                        message: 'What is the role title?'
                    },
                    {
                        type: 'input',
                        name: 'roleSalary',
                        message: 'What is the role salary?'
                    },
                    {
                        type: 'input',
                        name: 'roleId',
                        message: 'What is the role ID?'
                    }
                ]).then(function(roleObject) {
                    const { roleTitle, roleSalary, roleId } = roleObject;
                    handleAddARole(roleObject);
                    handleViewAllRoles();
                })
                break;
            case 'Add an employee':
                console.log('Add an employee');
                init();
                break;
            case 'Update an employee':
                console.log('Update an employee');
                init();
                break;
            default:
                console.log('Choice not avalible');
                database.close();      
        };
    });
}

const handleViewAllDepartments = async() => {
    console.log('view all departments');
    console.log("\n");
    database.query(`SELECT * FROM department`)
        .then((rows) => {
            console.table(rows);
            return init();
    });
};

const handleViewAllRoles = async() => {
    console.log('view all roles');
    console.log("\n");
    database.query(`SELECT * FROM role`)
        .then((rows) => {
            console.table(rows);
            return init();
    });
};

const handleViewAllEmployees = async() => {
    console.log('view all employess');
    console.log("\n");
    database.query(`SELECT employee.id, employee.first_name, 
    employee.last_name, role.title, department.name AS department, 
    role.salary, CONCAT(manager_employee.first_name, ' ', manager_employee.last_name) 
    AS manager FROM employee LEFT JOIN role ON role.id = employee.role_id LEFT JOIN department 
    ON role.department_id = department.id LEFT JOIN employee manager_employee ON employee.manager_id = manager_employee.id;`)
        .then((rows) => {
            console.table(rows);
            return init();
    });
};

const handleAddADepartment = async(answer) => {
    console.log(answer);
    console.log("\n");
    database.query(`INSERT INTO department (name) VALUE ("${answer}");`)
    .then(() => {
        return init();
    });
};

const handleAddARole = async({ roleTitle, roleSalary, roleId }) => {
    console.log({ roleTitle, roleSalary, roleId });
    console.log("\n");
    database.query(`INSERT INTO role (title, salary, department_id)
    VALUES ("${roleTitle}", ${roleSalary}, ${roleId});`)
    .then(() => {
        return init();
    });
};

init();

module.export = questions;