const dotenv = require("dotenv");
dotenv.config();

const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: "bookclub",
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
});

module.exports = { pool };
