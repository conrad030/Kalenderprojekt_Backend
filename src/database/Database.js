const mysql = require("mysql2");

let db;

function initDb(callback) {
  if (db) {
    if (callback) {
      callback(null, db);
    } else {
      return db;
    }
  } else {
    if (typeof global.it !== "function") {
      let options = {
        port: process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
      };
      db = mysql.createPool(options).promise();
    }
    //Test DB
    else {
      let options = {
        port: process.env.TEST_DATABASE_PORT,
        host: process.env.TEST_DATABASE_HOST,
        user: process.env.TEST_DATABASE_USER,
        password: process.env.TEST_DATABASE_PASSWORD,
        database: process.env.TEST_DATABASE_NAME,
      };
      db = mysql.createPool(options).promise();
    }
    callback(null, db);
  }
}

module.exports = {
  initDb,
};
