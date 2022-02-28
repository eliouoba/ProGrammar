var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "rooot",
  password: "A..912889"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});