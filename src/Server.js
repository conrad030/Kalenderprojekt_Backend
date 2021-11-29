const express = require("express");
const mysql = require("mysql2");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./src/config/.env" });

const db = mysql.createConnection({
  port: process.env.DATABASE_PORT,
  host: "localhost",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Error bei DB: " + err);
  } else {
    db.query("select 1 + 1");
    console.log("MySQL connected");
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
