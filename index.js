const inquirer = require('inquirer');
const Database = require('./connection/connection');
const cTable = require('console.table');


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
                handleViewAllDepartments();
                break;
            case 'View all roles':
                // TODO write query
                init();
                break;
            case 'View all employees':
                // TODO write query
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
    database.query(`SELECT * FROM department`)
        .then((rows) => {
            console.table(rows);
            return init();
    });
};

init();

module.export = questions;