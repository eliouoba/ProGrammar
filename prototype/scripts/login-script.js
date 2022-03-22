const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'newuser',
  password: 'newpassword',
  database: 'department'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

connection.query('SELECT * from student', (err, rows) => {
  if(err) throw err;
  console.log('The data from users table are: \n', rows);
  connection.end();
});