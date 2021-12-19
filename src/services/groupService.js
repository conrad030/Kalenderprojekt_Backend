const { log } = require("console");

const db = require("../database/Database").initDb();

exports.create = async function (name, password) {
  if (!name || !password) throw new Error("Invalid data");
  // Group name existance check left out

  //   TODO: Generate invite code
  let invCode = "https://fillerLink.com";
  // QUERY
  let query = `INSERT INTO SmartCalendar.Group (name, password, invitationCode, colorCode) 
    VALUES (?, ?, ?, FFFFFF);`;
  let exec = await db.query(query, [name, password, invCode]);
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
  let query = `UPDATE SmartCalendar.Group SET 
  name = ?,
  password = ?,
  WHERE id = ?;`;
  let [updatedGroups, fields] = await db.query(query, [id, name, password]);
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
  let query = `DELETE from SmartCalendar.Group WHERE id = ?'`;
  await db.query(query, [id]);
};

exports.findInvCode = async function (id) {
  if (!id) throw new Error("Invalid data");
  let query = `SELECT invitationCode FROM SmartCalendar.Group 
  WHERE id = ? `;
  let [invCodes, fields] = await db.query(query, [id]);
  return invCodes[0];
};
