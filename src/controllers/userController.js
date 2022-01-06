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
    req.session.userId = userId;
    req.session.isAdmin = isAdmin;
    res.status(200).json({ message: "User successfully logged in" });
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
