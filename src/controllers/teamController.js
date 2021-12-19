const teamService = require("../services/teamService");

exports.create = async (req, res) => {
  let { groupId, name, colorCode } = req.body;
  try {
    await teamService.createTeam(groupId, name, colorCode);
    res.status(201).json({ message: "created team" });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  let { teamId } = req.params;
  let { groupId } = req.body;

  try {
    await teamService.addMember(teamId, groupId);
    res.status(201).json({ message: "added user to team" });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    let allTeams = await teamService.findAll();
    res.status(200).json(allTeams);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  let { id } = req.params;
  try {
    let team = await teamService.findOne(id);
    res.status(200).json(team);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: "bad input" });
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
    res.status(404).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  let { id } = req.params;
  try {
    await teamService.delete(id);
    res.status(200).json({ message: "deleted team" });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({
      message: error.message,
    });
  }
};
