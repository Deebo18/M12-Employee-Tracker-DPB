// Get the client
const mysql = require('mysql2');
require('dotenv').config();

// Creates the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
},
console.log(`Connected to the employees database.`)
);

connection.connect(function (err) {
    if (err) throw err;
  });
  
module.exports = connection;
