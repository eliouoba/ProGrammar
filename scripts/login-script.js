  
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'newuser',
  password: 'newpassword',
  database: 'programmar'
});

connection.connect();

function getUserPass(userName){
  connection.query("SELECT password FROM user WHERE userid = userName", (err,rows)=> {
    if(err) throw err;
    return 
  }
  
  
  )
}
connection.query('SELECT * from user', (err, rows) => {
  if(err) throw err;
  console.log('The data from users table are: \n', rows);
  connection.end();
});