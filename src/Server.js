const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config()

// MYSQL
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

const teamRouter = require("./routes/teamRouter");
const appointmentRouter = require("./routes/appointmentRouter");
const groupRouter = require("./routes/groupRouter");
const userRouter = require("./routes/userRouter");

app.use("/teams", teamRouter);
app.use("/appointments", appointmentRouter);
app.use("/groups", teamRouter);
app.use("/users", userRouter);

// Connect
var corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
};

app.use(cors(corsOptions));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
