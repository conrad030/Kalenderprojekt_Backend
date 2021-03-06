const teamService = require("../services/teamService");

exports.create = async (req, res) => {
  let { groupId, name, colorCode } = req.body;
  try {
    let team = await teamService.createTeam(groupId, name, colorCode);
    res.status(201).json(team);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  let { teamId, userId } = req.query;

  try {
    let newMember = await teamService.addMember(teamId, userId);
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.delMember = async (req, res) => {
  let { teamId, userId } = req.query;

  try {
    let deletedMember = await teamService.removeMember(teamId, userId);
    res.status(200).json({ message: "Deleted team member" });
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    let allTeams = await teamService.findAll();
    res.status(200).json(allTeams);
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  let { id } = req.params;
  try {
    let team = await teamService.findOne(id);
    res.status(200).json(team);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  let { id } = req.params;
  let { name, colorCode } = req.body;
  try {
    let team = await teamService.update(id, name, colorCode);
    res.status(200).json(team);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  let { id } = req.params;
  try {
    let deletedTeam = await teamService.delete(id);
    res.status(200).json(deletedTeam);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

exports.getMembers = async function (req, res) {
  try {
    let users = await teamService.getMembers(req.params.id);
    res.status(200).json(users);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};
