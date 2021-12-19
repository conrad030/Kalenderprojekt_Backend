const { log } = require("console");

const db = require("../database/Database").initDb();

exports.create = async function (name, password) {
  if (!name || !password) throw new Error("Invalid data");
  // Group name existance check left out

  //   TODO: Generate invite code
  let invCode = "asdfg";
  // QUERY
  let insertQuery = `
  INSERT INTO SmartCalendar.Group (name, password, invitationCode, colorCode) VALUES (?, ?, ?, 'FFFFFF');`;
  let findQuery = `SELECT * FROM SmartCalendar.Group WHERE id = ?;`;

  let results = await db.query(insertQuery, [name, password, invCode]);
  let newGroup = await this.findOne(results[0].insertId);
  return newGroup;
};

exports.findAll = async function () {
  let query = `SELECT * FROM SmartCalendar.Group`;
  let [groups, fields] = await db.query(query);
  if (groups.length === 0) return;
  return groups;
};

exports.findOne = async function (id) {
  if (!id) throw new Error("missing arguments");
  let query = `SELECT * FROM SmartCalendar.Group
    WHERE id = ?;`;

  let [groups, fields] = await db.query(query, [id]);
  //No groups found
  if (groups.length === 0) return;
  return groups[0];
};

exports.update = async function (id, name, password) {
  if (!id || !name || !password) throw new Error("missing arguments");
  var group = await this.findOne(id);

  if (!group) throw new Error("Not found");
  let query = `UPDATE SmartCalendar.Group SET 
  name = ?,
  password = ?
  WHERE id = ?;`;

  await db.query(query, [name, password, id]);

  return group;
};

exports.delete = async function (id) {
  if (!id) throw new Error("Invalid data");
  var group = await this.findOne(id);

  if (!group) throw new Error("Not found");
  let deleteQuery = `DELETE from SmartCalendar.Group WHERE id = ?`;

  await db.query(deleteQuery, [id]);
  return group;
};

// TODO: How to detect User that is being added? A param?
// TODO: clear up isAdmin
exports.joinGroup = async function (invCode, user) {
  if (!invCode) throw new Error("Invalid data");
  let groupQuery = `SELECT * FROM SmartCalendar.Group 
  WHERE invitationCode = ?`;
  let [group, fields] = await db.query(query, [invCode]);
  let query = `INSERT INTO SmartCalendar.Group_Member (groupId, userId, isAdmin)
  VALUES (?, ?, ?)`;
  await db.query(query, [group[0].id, user.id, user.isAdmin]);
};
