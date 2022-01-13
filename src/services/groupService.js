const { log } = require("console");
const db = require("../database/Database").initDb();
const { ServiceError } = require("../errors");
const bcrypt = require("bcrypt");

/**
 * Generate a 5 char long invite code
 * @param {string} length
 * @returns invite code
 */
async function genInvCode(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  let invCodeQuery = `SELECT * FROM SmartCalendar.Group WHERE invitationCode = ?`;
  try {
    let [invCodeResult, fields] = await db.query(invCodeQuery, [result]);
    if (!invCodeResult.length == 0) genInvCode(length);
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }

  return result;
}

/**
 * Create new group and add current user as its admin
 * @param {string} name
 * @param {string} password
 * @param {number} userId
 * @returns json - created group
 */
exports.create = async function (name, password, userId) {
  if (!name || !password) throw new ServiceError("Invalid data", 400);
  try {
    let invCode = await genInvCode(5);
    let hash = await bcrypt.hash(password, 5);
    // let currentUser = userService.findById(userId)

    let groupInsertQuery = `
  INSERT INTO SmartCalendar.Group (name, password, invitationCode, colorCode) VALUES (?, ?, ?, 'FFFFFF');`;
    let adminInsertQuery = `INSERT INTO SmartCalendar.Group_Member (groupId, userId, isAdmin) VALUES (?, ?, ?)`;

    // Create and find new group
    let results = await db.query(groupInsertQuery, [name, hash, invCode]);
    let newGroup = await this.findOne(results[0].insertId);
    // Add user to new group and make them admin
    await db.query(adminInsertQuery, [newGroup.id, userId, true]);
    return newGroup;
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Get all groups
 * @returns Array - All groups
 */
exports.findAll = async function () {
  let query = `SELECT * FROM SmartCalendar.Group`;
  try {
    let [groups, fields] = await db.query(query);
    if (groups.length === 0) return;
    return groups;
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Get single group
 * @param {numer} id
 * @returns group
 */
exports.findOne = async function (id) {
  if (!id) throw new ServiceError("Invalid data", 400);
  let query = `SELECT * FROM SmartCalendar.Group
    WHERE id = ?;`;
  let groups;

  try {
    let results = await db.query(query, [id]);
    groups = results[0];
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }

  //No groups found
  if (groups.length === 0) throw new ServiceError("Not found", 404);
  return groups[0];
};

/**
 * Update one group
 * @param {number} id
 * @param {string} name
 * @param {string} password
 * TODO make parameters optional
 * @returns group
 */
exports.update = async function (id, name, password) {
  if (!id || !name || !password) throw new ServiceError("Invalid data", 400);
  await this.findOne(id);

  let hash = await bcrypt.hash(password, 5);

  let query = `UPDATE SmartCalendar.Group SET 
  name = ?,
  password = ?
  WHERE id = ?;`;

  try {
    await db.query(query, [name, hash, id]);
    group = await this.findOne(id);
    return group;
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Delete group
 * @param {number} id
 * @returns deleted group
 */
exports.delete = async function (id) {
  if (!id) throw new ServiceError("Invalid data", 400);
  var group = await this.findOne(id);

  if (!group) throw new ServiceError("Not found", 400);
  let deleteQuery = `DELETE from SmartCalendar.Group WHERE id = ?`;

  try {
    await db.query(deleteQuery, [id]);
    return group;
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Add current user to the group with given invite code
 * * The added user will always have isAdmin set to false
 * @param {string} invCode
 * @param {number} userId
 */
exports.joinGroup = async function (invCode, userId) {
  if (!invCode || !userId) throw new ServiceError("Invalid data", 400);
  let checkQuery = `SELECT * FROM SmartCalendar.Group_Member WHERE userId = ?`;
  let [member, memberFields] = await db.query(checkQuery, [userId]);
  if (!member.length == 0) throw new ServiceError("User already exists", 400);

  let query = `INSERT INTO SmartCalendar.Group_Member (groupId, userId, isAdmin)
  VALUES (?, ?, ?)`;

  let groupQuery = `SELECT * FROM SmartCalendar.Group 
  WHERE invitationCode = ?`;
  let [group, fields] = await db.query(groupQuery, [invCode]);

  try {
    await db.query(query, [group[0].id, userId, false]);
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }
};

const findMemberOfGroup = async function (userId, groupId) {
  if (!groupId || !userId) throw new Error("Missing arguments");
  let query = `
  SELECT * FROM SmartCalendar.Group_Member
  WHERE userId = ?
  AND groupId = ?;`;

  try {
    let [members, _] = await db.query(query, [userId, groupId]);
    //No members found
    if (members.length === 0) return null;
    members[0].isAdmin = members[0].isAdmin === 1;
    return members[0];
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.isGroupMember = async function (userId, groupId) {
  let member = await findMemberOfGroup(userId, groupId);
  return (await findMemberOfGroup(userId, groupId)) !== null;
};
