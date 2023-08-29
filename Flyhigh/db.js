const mysql = require("mysql2/promise");

let config = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "flyhigh",
};

async function query(sql, params) {
  const connection = await mysql.createConnection(config);
  const [results] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query,
};
