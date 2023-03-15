// Get the client
const mysql = require('mysql2');

// Creates the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employees'
},
console.log(`Connected to the employees database.`)
);

connection.connect(function (err) {
    if (err) throw err;
  });
  
module.exports = connection;
  