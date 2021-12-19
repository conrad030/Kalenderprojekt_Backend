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
  let results = await db.query(insertQuery, [name, password, invCode]);

  let findQuery = `SELECT * FROM SmartCalendar.Group WHERE id = ?;`;
  let [newGroup, fields] = await db.query(findQuery, [results[0].insertId]);
  return newGroup[0];
};

exports.findAll = async function () {
  let query = `SELECT * FROM SmartCalendar.Group`;
  let [groups, fields] = await db.query(query);
  if (groups.length === 0) return;
  return groups;
};

exports.findOne = async function (id) {
  let query = `SELECT * FROM SmartCalendar.Group
    WHERE id = ?;`;

  let [groups, fields] = await db.query(query, [id]);
  //No groups found
  if (groups.length == 0) return;
  return groups[0];
};

exports.update = async function (id, name, password) {
  if (!id || !name || !password) throw new Error("Invalid data");
  let updatedGroupQuery = `SELECT * FROM SmartCalendar.Group
  WHERE id = ?;`;

  let query = `UPDATE SmartCalendar.Group SET 
  name = ?,
  password = ?
  WHERE id = ?;`;

  await db.query(query, [name, password, id]);
  let [updatedGroups, fields] = await db.query(updatedGroupQuery, [id]);
  let group = updatedGroups[0];
  return {
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    invitationCode: group.invitationCode,
    colorCode: group.colorCode,
  };
};

exports.delete = async function (id) {
  if (!id) throw new Error("Invalid data");
  let groupQuery = `SELECT * FROM SmartCalendar.Group WHERE id = ?`;
  let deleteQuery = `DELETE from SmartCalendar.Group WHERE id = ?`;

  let [deletedGroups, fields] = await db.query(groupQuery, [id]);
  await db.query(deleteQuery, [id]);
  return deletedGroups[0];
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
