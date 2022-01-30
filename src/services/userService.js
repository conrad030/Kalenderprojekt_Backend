const db = require("../database/Database").initDb();
const bcrypt = require("bcrypt");
const { ServiceError } = require("../errors");

exports.makeDefaultAdmin = async function () {
  let adminQuery = `
  SELECT * FROM SmartCalendar.User
  WHERE isAdmin = 1;
  `;
  let [admins, _] = await db.query(adminQuery);
  if (admins.length > 0) return;
  let name = process.env.DEFAULT_ADMIN_NAME;
  let email = process.env.DEFAULT_ADMIN_EMAIL;
  let password = process.env.DEFAULT_ADMIN_PASSWORD;
  let hash = await bcrypt.hash(password, 5);
  let query = `
        INSERT INTO SmartCalendar.User (username, email, password, isAdmin)
        VALUES (?, ?, ?, true);
        `;
  try {
    let _ = await db.query(query, [name, email, hash]);
    console.log("Default admin created");
  } catch (error) {
    throw new ServiceError("Internal server error", 500);
  }
};

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
  if (users.length == 0) return null;
  return users[0];
};

exports.findOne = async function (id) {
  try {
    let query = `SELECT * FROM SmartCalendar.User 
    WHERE id = ?;`;
    let [users, fields] = await db.query(query, [id]);
    //No user found
    if (users.length == 0) throw new ServiceError("Not found", 404);
    return users[0];
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.findByEmail = async function (email) {
  let query = `SELECT * FROM SmartCalendar.User 
    WHERE email= ? `;
  let [users, fields] = await db.query(query, [email]);
  //No user found
  if (users.length == 0) return null;
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

exports.findGroupsForUser = async function (userId) {
  let query = `
  SELECT g.*
  FROM SmartCalendar.Group g, SmartCalendar.Group_Member member
  WHERE g.id = member.groupId
  AND member.userId = ?;
  `;
  try {
    let [groups, _] = await db.query(query, [userId]);
    return groups;
  } catch (error) {
    console.log(error);
    throw new serviceerror("internal server error", 500);
  }
};

exports.updateUser = async function (id, username, email, password) {
  {
    if (!id || !username || !email || !password)
      throw new ServiceError("Invalid data", 400);
    let hash = await bcrypt.hash(password, 5);

    let query = `UPDATE SmartCalendar.User SET 
  username = ?,
  email = ?,
  password = ?
  WHERE id = ?;`;

    try {
      await db.query(query, [username, email, hash, id]);
      let user = await this.findOne(id);
      return user;
    } catch (e) {
      if (e instanceof ServiceError) throw e;
      throw new ServiceError("Internal Service Error", 500);
    }
  }
};

exports.deleteUser = async function (userId) {
  var user = await this.findOne(userId);
  if (!user) throw new ServiceError("User not found", 404);
  let query = `
  DELETE FROM SmartCalendar.User
  WHERE id = ?;
  `;
  try {
    await db.query(query, [userId]);
    return user;
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};
