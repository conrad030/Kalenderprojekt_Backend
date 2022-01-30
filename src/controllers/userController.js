const userService = require("../services/userService");

exports.signup = async function (req, res) {
  let { username, email, password } = req.body;
  try {
    let newUser = await userService.createUser(username, email, password);
    res.status(201).json({ message: "user successfully created" });
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.login = async function (req, res) {
  var base64Credentials = req.headers.authorization.split(" ")[1];
  var credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  var [username, password] = credentials.split(":");
  try {
    let { userId, isAdmin } = await userService.login(username, password);
    req.session.regenerate(function (err) {
      req.session.userId = userId;
      req.session.isAdmin = isAdmin;
      res
        .status(200)
        .json({ message: "User successfully logged in", userId, isAdmin });
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "Bad input" });
  }
};

exports.logout = async function (req, res) {
  req.session.destroy();
  res.clearCookie("session_cookie", { path: "/" });
  res.status(200).json({ message: "user successfully logged out" });
};

exports.findGroupsForUser = async function (req, res) {
  try {
    let groups = await userService.findGroupsForUser(req.session.userId);
    res.status(200).json(groups);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.getUser = async function (req, res) {
  try {
    let user = await userService.findOne(req.params.id);
    res.status(200).json({
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.updateUser = async function (req, res) {
  try {
    let { username, email, password } = req.body;
    let { id } = req.params;
    let user = await userService.updateUser(id, username, email, password);
    res.status(200).json({
      userId: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (e) {
    console.error(e.message);
    res.status(e.statusCode).json({ message: e.message });
  }
};

exports.deleteUser = async function (req, res) {
  try {
    let user = await userService.deleteUser(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};
