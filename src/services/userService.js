const db = require("../database/Database").initDb();
const bcrypt = require("bcrypt");
const { ServiceError } = require("../errors");

exports.createUser = async function (username, email, password) {
  if (!username || !email || !password)
    throw new ServiceError("Missing data", 400);
  if (await this.findOneWithUsername(username))
    throw new ServiceError("username already exists", 400);
  if (await this.findByEmail(email))
    throw new ServiceError("email already exists", 400);
  //Query
  let hash = await bcrypt.hash(password, 5);
  let query = `
        INSERT INTO SmartCalendar.User (username, email, password)
        VALUES (\'${username}\', \'${email}\', \'${hash}\');
        `;
  try {
    let _ = await db.query(query);
  } catch (error) {
    throw new ServiceError("Internal server error", 500);
  }
};

exports.login = async function (username, password) {
  if (!username || !password) throw new Error("invalid data");
  var user = await this.findOneWithUsername(username);
  if (!user) throw new Error("Not found");
  let result = await bcrypt.compare(password, user.password);
  if (result) {
    //Correct password
    return { userId: user.id, isAdmin: user.isAdmin };
  } else {
    //Wrong password
    throw new Error("Wrong password");
  }
};

exports.findOneWithUsername = async function (username) {
  let query = `SELECT * FROM SmartCalendar.User 
    WHERE username = ?;`;

  let [users, fields] = await db.query(query, [username]);
  //No user found
  if (users.length == 0) return;
  return users[0];
};

exports.findOne = async function (id) {
  let query = `SELECT * FROM SmartCalendar.User 
    WHERE id = ?;`;

  let [users, fields] = await db.query(query, [id]);
  //No user found
  if (users.length == 0) return;
  return users[0];
};

exports.findByEmail = async function (email) {
  let query = `SELECT * FROM SmartCalendar.User 
    WHERE email= ? `;

  let [users, fields] = await db.query(query, [email]);
  //No user found
  if (users.length == 0) return;
  return users[0];
};

exports.findById = async function (id) {
  let query = `SELECT * FROM SmartCalendar.User 
    WHERE id = ? `;

  let [users, fields] = await db.query(query, [id]);
  //No user found
  if (users.length == 0) return;
  return users[0];
};
