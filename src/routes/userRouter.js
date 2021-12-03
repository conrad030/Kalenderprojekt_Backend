var express = require("express");
const controller = require("../controllers/userController");
var router = express.Router();

// Create User
router.post("/signup", controller.signup);

// Login User
router.post("/login", controller.login);

module.exports = router;
