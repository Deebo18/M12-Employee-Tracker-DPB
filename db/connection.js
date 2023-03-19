// Get the client
const mysql = require('mysql2');
require('dotenv').config();

// Creates the connection to database
const connection = mysql.createConnection({
  process.evv.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
  }
console.log(`Connected to the employees database.`)
});

connection.connect(function (err) {
    if (err) throw err;
  });
  
module.exports = connection;
  