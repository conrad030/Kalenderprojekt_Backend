const db = require("../database/Database").initDb();
const bcrypt = require("bcrypt");

exports.createUser = async function (username, email, password) {
  if (!username || !email || !password) throw new Error("Invalid data");
  if (await this.findOne(username)) throw new Error("username already exists");
  if (await findByEmail(email)) throw new Error("email already exists");
  //Query
  let hash = await bcrypt.hash(password, 5);
  let query = `
        INSERT INTO SmartCalendar.User (username, email, password)
        VALUES (\'${username}\', \'${email}\', \'${hash}\');
        `;
  let _ = await db.query(query);
};

exports.login = async function (username, password) {
  if (!username || !password) throw new Error("invalid data");
  var user = await this.findOne(username);
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

exports.findOne = async function findOne(username) {
  let query = `SELECT * FROM SmartCalendar.User 
    WHERE username=\'${username}\'`;

  let [users, fields] = await db.query(query);
  //No user found
  if (users.length == 0) return;
  return users[0];
};

async function findByEmail(email) {
  let query = `SELECT * FROM SmartCalendar.User 
    WHERE email=\'${email}\'`;

  let [users, fields] = await db.query(query);
  //No user found
  if (users.length == 0) return;
  return users[0];
}
