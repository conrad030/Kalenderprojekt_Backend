const db = require("../database/Database").initDb();

exports.createTeam = async function (groupId, name, colorCode) {
  if (!groupId || !name || !colorCode) throw new Error("Invalid data");
  let query = `INSERT INTO SmartCalendar.Team (groupId, name, colorCode) 
    VALUES (?, ?, ?);
`;
  await db.query(query, [groupId, name, colorCode]);
};

exports.addMember = async function (teamId, userId) {
  if (!userId || !teamId) throw new Error("missing arguments");
  var team = this.findOne(teamId);
  if (!team) throw new Error("Not found");

  let insertQuery = `INSERT INTO SmartCalendar.User_Team (teamId, userId)
  VALUES (?, ?)`;
  let findQuery = `SELECT * FROM SmartCalendar.User_Team WHERE id = ?;`;

  let results = await db.query(insertQuery, [teamId, userId]);
  await db.query(findQuery, [results[0].insertId]);
};

exports.findAll = async function () {
  let query = `SELECT * FROM SmartCalendar.Team`;
  let [allTeams, fields] = await db.query(query);
  return allTeams;
};

exports.findOne = async function (id) {
  if (!id) throw new Error("missing arguments");
  let query = `SELECT * FROM SmartCalendar.Team
    WHERE id = ? ;
`;
  let [teams, fields] = await db.query(query, [id]);
  //No team found
  if (teams.length === 0) return;
  return teams[0];
};

exports.update = async function (id, name, colorCode) {
  if (!id || !name || !colorCode) throw new Error("missing arguments");
  var team = this.findOne(id);
  if (!team) throw new Error("Not found");

  let query = `UPDATE SmartCalendar.Team SET 
  name = ?,
  colorCode = ?
  WHERE id = ?;`;

  await db.query(query, [name, colorCode, id]);
  let updatedTeam = await this.findOne(id);

  return updatedTeam;
};

exports.delete = async function (id) {
  if (!id) throw new Error("Invalid data");
  var team = await this.findOne(id);
  if (!team) throw new Error("Not found");

  let query = `DELETE from SmartCalendar.Team WHERE id = ?`;

  await db.query(query, [id]);
};
