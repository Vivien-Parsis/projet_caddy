const mysql = require('mysql');
const fs = require('fs');
const login = require('../../private/login.json');
// const login = {
//     username:"",
//     login:""
// }
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
  connection.query(sqlQueries, (error, results, fields) => {
    if (error) throw error;
    console.log('database successfully init');
    connection.end((err) => {
      if (err) {
        console.log("error while ending connection to database");
        if (err) throw err;
      } else {
        console.log('database connection end successfully');
      }
    });
  });
});
