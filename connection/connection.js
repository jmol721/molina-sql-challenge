require('dotenv').config();

const mysql = require('mysql2');
const config = {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
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

module.exports = Database;