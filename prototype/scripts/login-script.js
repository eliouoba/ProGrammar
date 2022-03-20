const {createPool} = require('mysql')

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "A..912889",
})


pool.query('select * from ')