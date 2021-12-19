const groupService = require("../services/groupService");

exports.create = async (req, res) => {
  let { name, password } = req.body;
  try {
    let newGroup = await groupService.create(name, password);
    res.send(201).json(newGroup);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "bad input" });
  }
};

exports.findAll = (req, res) => {
  try {
    let allGroups = await groupService.findAll();
    res.send(200).json(allGroups);
  } catch (error) {
    console.error(error.message);
    res.status(403);
  }
};

exports.findOne = (req, res) => {};

exports.findInvCode = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
