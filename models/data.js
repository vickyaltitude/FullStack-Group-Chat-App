require('dotenv').config();
const mysql2 = require('mysql2');

const pool = mysql2.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   database: process.env.DB_DATABASE,
   password: process.env.DB_password
})

module.exports = pool.promise();