const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres", 
  host: "postgres",    
  database: "postgres", 
  password: "postgres_password", 
  port: 5432,            
});

module.exports = pool;
