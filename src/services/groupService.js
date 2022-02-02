const { log, group: newGroup } = require("console");
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
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }

  return result;
}

/**
 * Create new group and add current user as its admin
 * @param {string} name
 * @param {string} password
 * @param {string} colorCode
 * @param {number} userId
 * @returns json - created group
 */
exports.create = async function (name, password, colorCode, userId) {
  if (!userId || !name || !colorCode)
    throw new ServiceError("Invalid data", 400);
  try {
    let invCode = await genInvCode(5);
    let hash = null;
    if (password) {
      hash = await bcrypt.hash(password, 5);
    }

    let groupInsertQuery = `
  INSERT INTO SmartCalendar.Group (name, invitationCode, colorCode${
    password ? ", password" : ""
  }) VALUES (?, ?, ?${password ? ", ?" : ""});`;
    let adminInsertQuery = `INSERT INTO SmartCalendar.Group_Member (groupId, userId, isAdmin) VALUES (?, ?, ?)`;

    // Create and find new group
    let results = await db.query(groupInsertQuery, [
      name,
      invCode,
      colorCode,
      hash,
    ]);
    let newGroup = await this.findOne(results[0].insertId);

    // Add user to new group and make them admin
    await db.query(adminInsertQuery, [newGroup.id, userId, true]);
    let result = await this.structure(newGroup);
    return result;
  } catch (e) {
    console.log(e);
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Get all teams of groups
 * @returns Array - All teams of group
 */
exports.findAll = async function () {
  let query = `SELECT * FROM SmartCalendar.Group`;
  try {
    let [groups, fields] = await db.query(query);
    const structuredGroups = groups.map(async (group) => {
      let g = await this.structure(group);
      return g;
    });
    return Promise.all(structuredGroups).then((value) => {
      return value;
    });
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.findAllTeams = async function (groupId) {
  let query = `SELECT * FROM SmartCalendar.Team WHERE groupId = ?`;
  try {
    if (!groupId) throw new ServiceError("Invalid data", 400);
    await this.findOne(groupId);
    let [teams, fields] = await db.query(query, [groupId]);
    return teams;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Get all groups
 * @returns Array - All groups
 */
exports.findAll = async function (groupId) {
  let query = `SELECT * FROM SmartCalendar.Group`;
  try {
    let [groups, fields] = await db.query(query, [groupId]);
    return groups;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.structure = async function (group) {
  let query = `SELECT * FROM SmartCalendar.Group_Member WHERE groupId = ?`;
  let teamsQuery = `SELECT * FROM SmartCalendar.Team WHERE groupId = ?`;
  let [members, fields] = await db.query(query, [group.id]);
  // Don't use findAllTeams to avoid recursion
  let [teams, f] = await db.query(teamsQuery, [group.id]);
  return {
    id: group.id,
    name: group.name,
    createdAt: group.createdAt,
    invitationCode: group.invitationCode,
    colorCode: group.colorCode,
    teams,
    members,
  };
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
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }

  //No groups found
  if (groups.length === 0) throw new ServiceError("Not found", 404);
  let result = await this.structure(groups[0]);
  return result;
};

exports.updateName = async function (id, name) {
  if (!id || !name) throw new ServiceError("Invalid data", 400);

  let query = `UPDATE SmartCalendar.Group SET 
  name = ?
  WHERE id = ?;`;

  try {
    await db.query(query, [name, id]);
    let group = await this.findOne(id);
    return group;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.updatePassword = async function (id, password) {
  if (!id || !password) throw new ServiceError("Invalid data", 400);
  let hash = await bcrypt.hash(password, 5);

  let query = `UPDATE SmartCalendar.Group SET 
  password = ?
  WHERE id = ?;`;

  try {
    await db.query(query, [hash, id]);
    let group = await this.findOne(id);
    return group;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.updateColor = async function (id, colorCode) {
  if (!id || !colorCode) throw new ServiceError("Invalid data", 400);

  let query = `UPDATE SmartCalendar.Group SET 
  colorCode = ?
  WHERE id = ?;`;

  try {
    await db.query(query, [colorCode, id]);
    let group = await this.findOne(id);
    return group;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Update one group
 * @param {number} id
 * @param {string} name
 * @param {string} password
 * @param {string} colorCode
 * @returns group
 */
exports.update = async function (id, name, password, colorCode, userId) {
  if (!id || (!name && !password && !colorCode))
    throw new ServiceError("Invalid Data", 400);

  try {
    await this.findOne(id);
    await isGroupAdmin(id, userId);
    if (name) await this.updateName(id, name);
    if (password) await this.updatePassword(id, password);
    if (colorCode) await this.updateColor(id, colorCode);
    let group = await this.findOne(id);
    let result = await this.structure(group);
    return result;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Delete group
 * @param {number} id
 * @param {number} userId
 * @returns deleted group
 */
exports.delete = async function (id, userId) {
  if (!id) throw new ServiceError("Invalid data", 400);
  var group = await this.findOne(id);

  if (!group) throw new ServiceError("Not found", 400);
  let deleteQuery = `DELETE from SmartCalendar.Group WHERE id = ?`;

  try {
    await isGroupAdmin(id, userId);
    let result = await this.structure(group);
    await db.query(deleteQuery, [id]);
    return result;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};
/**
 * Checks if the logged in user is in the group and then if they are group admin
 * @param  {number} groupId
 * @param  {number} userId
 * @returns true (if admin)
 */

async function isGroupAdmin(groupId, userId) {
  try {
    let query = `SELECT * FROM SmartCalendar.Group_Member WHERE (groupId = ? AND userId = ?)`;
    let [member, fields] = await db.query(query, [groupId, userId]);
    if (member.length == 0)
      throw new ServiceError("Forbidden, not group member", 403);
    if (!member[0].isAdmin)
      throw new ServiceError("Forbidden, not group admin", 403);
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
  return true;
}

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
  } catch (e) {
    if (e instanceof ServiceError) throw e;
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
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.isGroupMember = async function (userId, groupId) {
  let member = await findMemberOfGroup(userId, groupId);
  return (await findMemberOfGroup(userId, groupId)) !== null;
};
