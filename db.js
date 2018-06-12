const mysql = require('mysql');
const db_config = require('./config/db-config.json');

let db;
function connectDB() {
    if (!db) {
        db = mysql.createConnection(db_config);
        db.connect(function(err) {
            if (!err) {
                console.log('Database is connected');
            } else {
                console.log('Error: ', err);
            }
        });
    }

    return db;
}

module.exports = connectDB();
