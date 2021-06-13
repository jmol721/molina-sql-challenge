// const Sequelize = require('sequelize');

// require('dotenv').config();
const mysql = require('mysql2');
const config = {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // {TODO: Add your MySQL password}
    password: 'Audilambo721',
    database: 'employee_tracker'
};

class Database {
    constructor() {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query(sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}


// create connection to our db
// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         // MySQL username,
//         user: 'root',
//         // {TODO: Add your MySQL password}
//         password: 'Audilambo721',
//         database: 'employee_tracker'
//         },
//         console.log(`Connected to the employee_tracker database.`)
// );

// db.query(`SELECT * FROM department`, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

module.exports = Database;