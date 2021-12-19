const db = require("../database/Database").initDb();

exports.createTeam = async function (groupId, name, color) {
  if (!groupId || !name || !color) throw new Error("Invalid data");
  var team = this.findOne(name);
  if (!team) throw new Error("Not found");
  let query = `INSERT INTO SmartCalendar.Team (groupId, name, color) 
    VALUES (\'${groupdId}\', \'${name}\', \'${color}\');;
`;
  let newTeam = await db.query(query);
};

exports.findOne = async function (name) {
  `
  let query = SELECT * FROM SmartCalendar.Team
    WHERE name=\'${name}\';
`;
  let [teams, fields] = await db.query(query);
  //No team found
  if (teams.length === 0) return;
  return teams[0];
};
