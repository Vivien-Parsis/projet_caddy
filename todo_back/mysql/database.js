const mysql = require('mysql');
const fs = require('fs');
const login =  fs.existsSync('./private/login.json') ? require('./../private/login.json') 
: {"username":"","password":""}; //put your mysql login here
const connection = mysql.createConnection({
    host:"localhost",
    user:login.username,
    password:login.password,
    multipleStatements: true
});
const sqlQueries = fs.readFileSync('mysql/database.sql', 'utf-8');
connection.connect((err) => {
    if (err) {
        console.log("error while ending connection to database");
        throw err;
    }
    connection.query(sqlQueries, (error, results) => {
        if (error) throw error;
        console.log('database successfully init');
        connection.end((err) => {
        if (err) {
            console.log("error while ending connection to database");
            if (err) throw err;
        } else {
            console.log('database connection end successfully');
        }}
    );});
});
