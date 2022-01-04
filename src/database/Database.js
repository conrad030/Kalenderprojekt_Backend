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
    let options = {
      port: process.env.DATABASE_PORT,
      host: "db-smartcalendar-mysql-do-user-10435412-0.b.db.ondigitalocean.com",
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    };

    db = mysql.createPool(options).promise();

    // db.connect((err) => {
    //   if (err) {
    //     console.log("Error bei DB: " + err);
    //     callback("Error bei DB: " + err);
    //   } else {
    //     db.query("select 1 + 1");
    //     console.log("MySQL connected");

    //     callback(null, db);
    //   }
    // });
  }
}

module.exports = {
  initDb,
};
