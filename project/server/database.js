var mysql = require('mysql');

class Database {
    constructor() { }

    getConnection() {
        // Retorna una connexió a la BD MySQL
        return mysql.createConnection(
            {
                insecureAuth: true,
                host: 'localhost',
                port: '3306',
                user: 'root',
                password: 'LaPutaContrasenya_1947',
                database: 'docencia'
            });
    }
}

module.exports = {
    Database: Database
}