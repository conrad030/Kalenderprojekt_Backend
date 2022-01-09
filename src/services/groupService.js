const { log } = require("console");
const db = require("../database/Database").initDb();
const { ServiceError } = require("../errors");

async function genInvCode(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  let invCodeQuery = `SELECT * FROM SmartCalendar.Group WHERE invitationCode = ?`;
  let [invCodeResult, fields] = await db.query(invCodeQuery, [result]);
  if (!invCodeResult.length == 0) genInvCode(length);

  return result;
}

//   TODO: Generate invite code
// TODO: Create admin group member
exports.create = async function (name, password) {
  if (!name || !password) throw new ServiceError("Invalid data", 400);
  let invCode = await genInvCode(5);

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
  if (!id) throw new ServiceError("Invalid data", 400);
  let query = `SELECT * FROM SmartCalendar.Group
    WHERE id = ?;`;

  let [groups, fields] = await db.query(query, [id]);
  //No groups found
  if (groups.length === 0) throw new ServiceError("Not found", 404);
  return groups[0];
};

exports.update = async function (id, name, password) {
  if (!id || !name || !password) throw new ServiceError("Invalid data", 400);
  var group = await this.findOne(id);

  if (!group) throw new ServiceError("Not found", 404);
  let query = `UPDATE SmartCalendar.Group SET 
  name = ?,
  password = ?
  WHERE id = ?;`;

  await db.query(query, [name, password, id]);

  return group;
};

// TODO: Cascade delete group_members and appointments a la Appointment_Member On Cascade in init.sql
exports.delete = async function (id) {
  if (!id) throw new ServiceError("Invalid data", 400);
  var group = await this.findOne(id);

  if (!group) throw new ServiceError("Not found", 400);
  let deleteQuery = `DELETE from SmartCalendar.Group WHERE id = ?`;

  await db.query(deleteQuery, [id]);
  return group;
};

// TODO: How to detect User that is being added? A param?
// TODO: Auto-join user to group on create

exports.joinGroup = async function (invCode, userId) {
  if (!invCode || !userId) throw new ServiceError("Invalid data", 400);
  let checkQuery = `SELECT * FROM SmartCalendar.Group_Member WHERE userId = ?`;
  let [member, memberFields] = await db.query(checkQuery, [userId]);
  if (!member.length == 0) throw new ServiceError("User already exists", 400);

  let groupQuery = `SELECT * FROM SmartCalendar.Group 
  WHERE invitationCode = ?`;
  let [group, fields] = await db.query(groupQuery, [invCode]);

  let query = `INSERT INTO SmartCalendar.Group_Member (groupId, userId, isAdmin)
  VALUES (?, ?, ?)`;
  await db.query(query, [group[0].id, userId, false]);
};
