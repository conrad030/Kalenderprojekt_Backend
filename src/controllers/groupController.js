const groupService = require("../services/groupService");

exports.create = async (req, res) => {
  let { name, password, colorCode } = req.body;
  let id = req.session.userId;
  try {
    let newGroup = await groupService.create(name, password, colorCode, id);
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    let allGroups = await groupService.findAll();
    res.status(200).json(allGroups);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findAllTeams = async (req, res) => {
  try {
    let allGroups = await groupService.findAllTeams(req.params.id);
    res.status(200).json(allGroups);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    let allGroups = await groupService.findAll(req.params.id);
    res.status(200).json(allGroups);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  let { id } = req.params;
  try {
    let group = await groupService.findOne(id);
    res.status(200).json(group);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  const id = req.session.userId;
  const { invCode, password } = req.query;

  try {
    let group = await groupService.joinGroup(invCode, password, id);
    res.status(200).json(group);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  let { id } = req.params;
  let { name, password, colorCode } = req.body;
  let { userId } = req.session;
  try {
    let group = await groupService.update(
      id,
      name,
      password,
      colorCode,
      userId
    );
    res.status(200).json(group);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  let { id } = req.params;
  let { userId } = req.session;
  try {
    let deletedGroup = await groupService.delete(id, userId);
    res.status(200).json(deletedGroup);
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};
