const groupService = require("../services/groupService");

exports.create = async (req, res) => {
  let { name, password } = req.body;
  try {
    let newGroup = await groupService.create(name, password);
    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "bad input" });
  }
};

exports.findAll = async (req, res) => {
  try {
    let allGroups = await groupService.findAll();
    res.status(200).json(allGroups);
  } catch (error) {
    console.error(error.message);
    res.status(403).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  let { id } = req.params;
  try {
    let group = await groupService.findOne(id);
    res.status(200).json(group);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: "bad input" });
  }
};

exports.joinGroup = async (req, res) => {
  const id = req.session.userId;
  const invCode = req.params.invCode;
  try {
    await groupService.joinGroup(invCode, id);
    res.status(200).json({ message: "User joined Group" });
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  let { id } = req.params;
  let { name, password } = req.body;
  try {
    let group = await groupService.update(id, name, password);
    res.status(200).json(group);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  let { id } = req.params;
  try {
    let deletedGroup = await groupService.delete(id);
    res.status(200).json(deletedGroup);
  } catch (error) {
    console.error(error.message);
    res.status(404).json({
      message: error.message,
    });
  }
};
