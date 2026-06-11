import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB CONFIG:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '***' : '(empty)',
  database: process.env.DB_NAME
});

const pool = mysql.createPool({

  host: process.env.DB_HOST,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0

});

pool.getConnection((err, connection) => {

  if (err) {

    console.error(
      'MySQL Connection Error:',
      err
    );

    return;

  }

  console.log(
    '✅ MySQL Connected'
  );

  connection.release();

});

export default pool;