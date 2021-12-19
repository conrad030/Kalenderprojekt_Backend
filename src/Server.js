const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mysqlSession = require("mysql2/promise");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

app.use(express.json());

// MYSQL
const db = require("./database/Database");
db.initDb((error, db) => {
  if (error) {
    console.log(error);
  }
});

//Session Store
let options = {
  port: process.env.DATABASE_PORT,
  host: "localhost",
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

var connection = mysqlSession.createPool(options);
var sessionStore = new MySQLStore({}, connection);

app.use(
  session({
    key: "session_cookie",
    secret: process.env.SESSION_COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      httpOnly: true,
      sameSite: true,
      maxAge: 4.32e7,
      path: "/",
    },
  })
);

const teamRouter = require("./routes/teamRouter");
const appointmentRouter = require("./routes/appointmentRouter");
const groupRouter = require("./routes/groupRouter");
const userRouter = require("./routes/userRouter");

app.use("/teams", teamRouter);
app.use("/appointments", appointmentRouter);
app.use("/groups", groupRouter);
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
