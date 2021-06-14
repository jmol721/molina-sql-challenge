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
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "What is the employee's first name?"
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "What is the employee's last name?"
                    }
                ]).then(function(employeeName) {
                    const employeeTOAdd = {};
                    const { firstName, lastName } = employeeName;
                    employeeTOAdd.first_name = firstName;
                    employeeTOAdd.last_name = lastName;
                    database.query(`SELECT title, id FROM role;`, (err, data) => {
                        const employeeRoles = data.map(({ id, title }) => ({ name: title, value: id }));
                        console.log(employeeRoles);
                        console.log(data);
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'employeeRole',
                                message: "What is the employee's role?",
                                choices: employeeRoles
                            }
                        ]).then(empRole => {
                            const {employeeRole: employeeRoleId } = empRole;
                            employeeTOAdd.role_id = employeeRoleId;

                            database.query("SELECT id, CONCAT(first_name, ' ', last_name) as name FROM employee;", (err, data) => {
                                const employeeManagers = data.map(({ id, name }) => ({ name, value: id }));
                                inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'employeeManager',
                                    message: "Who is the employee's manager?",
                                    choices: employeeManagers 
                                }
                                ]).then((empManager) => {
                                    const { employeeManager: employeeManagerId } = empManager;
                                    employeeTOAdd.manager_id = employeeManagerId;

                                    const insertSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES ("${employeeTOAdd.first_name}", "${employeeTOAdd.last_name}", ${employeeTOAdd.role_id}, ${employeeTOAdd.manager_id});`
                                    database.query(insertSql, (err) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            handleViewAllEmployees();
                                            init();
                                        }
                                    });
                                });
                            });
                        });
                    });
                    
                })
                break;
            case 'Update an employee':
                console.log('Update an employee');
                const updatedEmployee = {};
                database.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee;", (err, data) => {
                    const employeeNames = data.map(({ id, name }) => ({ name, value: id }));
                    inquirer.prompt([
                    {
                        type: 'list',
                        name: 'updateEmployeeName',
                        message: "Which employee would you like to update?",
                        choices: employeeNames
                    }
                    ]).then((empNames) => {
                        // { updateEmployeeName: id }
                        updatedEmployee.id = empNames.updateEmployeeName;
                        database.query(`SELECT department_id, title FROM role;`, (err, data) => {
                            const employeeRoles = data.map(({ department_id, title }) => ({ name: title, value: department_id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'employeeNewRole',
                                    message: "What is the employee's NEW role?",
                                    choices: employeeRoles
                                }
                            ]).then(empNewRole => {
                                // { employeeNewRole: id }
                                updatedEmployee.role_id = empNewRole.employeeNewRole;
                                console.log(updatedEmployee);
                                database.query(`UPDATE employee SET role_id = ${updatedEmployee.role_id} WHERE id = ${updatedEmployee.id}`, (err, data) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        handleViewAllEmployees();
                                        init();
                                    }
                                });
                            });
                        });
                    });
                });
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

const handleAddAnEmployee = async() => {
    database.query(`SELECT title FROM role;`)
    .then(() => {
        return init();
    });
};

init();

module.export = questions;