const db = require("../database/Database").initDb();
const { ServiceError } = require("../errors");
const groupService = require("./groupService");

/**
 * Create a team
 * @param {number} groupId
 * @param {string} name
 * @param {string} colorCode
 * @returns created Team
 */
exports.createTeam = async function (groupId, name, colorCode) {
  if (!groupId || !name || !colorCode)
    throw new ServiceError("Invalid data", 400);
  let query = `INSERT INTO SmartCalendar.Team (name, colorCode, groupid) VALUES (?, ?, ?);
`;
  try {
    await groupService.findOne(groupId);
    let results = await db.query(query, [name, colorCode, groupId]);
    let newTeam = await this.findOne(results[0].insertId);
    return newTeam;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Add a user to a team
 * @param {number} teamId
 * @param {number} userId
 */
exports.addMember = async function (teamId, userId) {
  if (!userId || !teamId) throw new ServiceError("Invalid data", 400);
  var team = await this.findOne(teamId);
  if (!team) throw new ServiceError("Not found", 404);

  let insertQuery = `INSERT INTO SmartCalendar.User_Team (teamId, userId)
  VALUES (?, ?)`;
  try {
    if (await this.isTeamMember(userId, teamId))
      throw new ServiceError("Already member of team", 409);
    await db.query(insertQuery, [teamId, userId]);
    let newMember = await this.findMember(userId, teamId);
    return newMember;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Remove user from team
 * @param {number} teamId
 * @param {number} userId
 */
exports.removeMember = async function (teamId, userId) {
  if (!userId || !teamId) throw new ServiceError("Invalid data", 400);
  var team = await this.findOne(teamId);
  if (!team) throw new ServiceError("Not found", 404);

  let removeQuery = `DELETE FROM SmartCalendar.User_Team WHERE teamId = ? AND userId = ?;`;
  try {
    await this.isTeamMember(userId, teamId);
    await db.query(removeQuery, [teamId, userId]);
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 *
 * @returns Array - all teams
 */
exports.findAll = async function () {
  try {
    let query = `SELECT * FROM SmartCalendar.Team`;
    let [allTeams, fields] = await db.query(query);
    return allTeams;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Get one team
 * @param {number} id
 * @returns team
 */
exports.findOne = async function (id) {
  if (!id) throw new ServiceError("Invalid data", 400);
  let query = `SELECT * FROM SmartCalendar.Team
    WHERE id = ? ;
`;
  let teams;
  try {
    let results = await db.query(query, [id]);
    let members = await this.getMembers(id);
    teams = results[0];
    teams[0].members = members;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
  //No team found
  if (teams.length === 0) throw new ServiceError("Not found", 404);
  return teams[0];
};

exports.updateName = async function (id, name) {
  if (!id || !name) throw new ServiceError("Invalid data", 400);

  let query = `UPDATE SmartCalendar.Team SET 
  name = ?
  WHERE id = ?;`;
  try {
    await db.query(query, [name, id]);
    let updatedTeam = await this.findOne(id);
    return updatedTeam;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.updateColor = async function (id, colorCode) {
  if (!id || !colorCode) throw new ServiceError("Invalid data", 400);

  let query = `UPDATE SmartCalendar.Team SET 
  colorCode = ?
  WHERE id = ?;`;
  try {
    await db.query(query, [colorCode, id]);
    let updatedTeam = await this.findOne(id);
    return updatedTeam;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Update one teams information
 * @param {number} id
 * @param {string} name
 * @param {string} colorCode
 * @returns updated team
 */
exports.update = async function (id, name, colorCode) {
  if (!id || (!name && !colorCode)) throw new ServiceError("Invalid data", 400);

  try {
    await this.findOne(id);
    if (name) await this.updateName(id, name);
    if (colorCode) await this.updateColor(id, colorCode);
    let updatedTeam = await this.findOne(id);
    return updatedTeam;
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

/**
 * Delete one team
 * @param {number} id
 * @returns deleted team
 */
exports.delete = async function (id) {
  if (!id) throw new ServiceError("Invalid data", 400);
  var team = await this.findOne(id);

  let deleteQuery = `DELETE from SmartCalendar.Team WHERE id = ?`;
  try {
    await db.query(deleteQuery, [id]);
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }

  return team;
};

exports.getMembers = async function (teamId) {
  let query = `
  SELECT user.id, user.username, user.email
  FROM SmartCalendar.User user, SmartCalendar.User_Team member
  WHERE user.id = member.userId
  AND member.teamId = ?;`;
  try {
    let [users, _] = await db.query(query, [teamId]);
    return users;
  } catch (error) {
    throw new ServiceError("Internal server error", 500);
  }
};

exports.findMember = async function (userId, teamId) {
  if (!teamId || !userId) throw new Error("Missing arguments");
  let query = `
  SELECT * FROM SmartCalendar.User_Team
  WHERE userId = ?
  AND teamId = ?;`;

  try {
    let [members, _] = await db.query(query, [userId, teamId]);
    //No members found
    if (members.length === 0) return null;
    return members[0];
  } catch (e) {
    if (e instanceof ServiceError) throw e;
    throw new ServiceError("Internal Service Error", 500);
  }
};

exports.isTeamMember = async function (userId, teamId) {
  let member = await this.findMember(userId, teamId);
  return (await this.findMember(userId, teamId)) !== null;
};
