var express = require("express");
const controller = require("../controllers/userController");
var router = express.Router();
const middleware = require("../middleware/Middleware");

// Create User
router.post("/signup", controller.signup);

// Login User
router.post("/login", controller.login);

//logout User
router.post("/logout", controller.logout);

module.exports = router;
