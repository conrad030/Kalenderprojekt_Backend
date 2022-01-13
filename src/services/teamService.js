const db = require("../database/Database").initDb();
const { ServiceError } = require("../errors");

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
  let query = `INSERT INTO SmartCalendar.Team (groupId, name, colorCode) 
    VALUES (?, ?, ?);
`;
  try {
    let results = await db.query(query, [groupId, name, colorCode]);
    let newTeam = await this.findOne(results[0].insertId);
    return newTeam;
  } catch (err) {
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
  var team = this.findOne(teamId);
  if (!team) throw new ServiceError("Not found", 404);

  let insertQuery = `INSERT INTO SmartCalendar.User_Team (teamId, userId)
  VALUES (?, ?)`;
  let findQuery = `SELECT * FROM SmartCalendar.User_Team WHERE id = ?;`;
  try {
    let results = await db.query(insertQuery, [teamId, userId]);
    let newMember = await db.query(findQuery, [results[0].insertId]);
    return newMember;
  } catch (err) {
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
  } catch (err) {
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
    teams = results[0];
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }

  //No team found
  if (teams.length === 0) throw new ServiceError("Not found", 404);
  return teams[0];
};

/**
 * Update one teams information
 * @param {number} id
 * @param {string} name
 * @param {string} colorCode
 * @returns updated team
 */
exports.update = async function (id, name, colorCode) {
  if (!id || !name || !colorCode) throw new ServiceError("Invalid data", 400);
  this.findOne(id);

  let query = `UPDATE SmartCalendar.Team SET 
  name = ?,
  colorCode = ?
  WHERE id = ?;`;
  try {
    await db.query(query, [name, colorCode, id]);
    let updatedTeam = await this.findOne(id);
    return updatedTeam;
  } catch (err) {
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
  } catch (err) {
    throw new ServiceError("Internal Service Error", 500);
  }

  return team;
};
