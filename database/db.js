const mysql = require('mysql2');
require('dotenv').config();

const dbConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

dbConnection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Database connected...');
});

module.exports = dbConnection;
