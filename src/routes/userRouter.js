var express = require("express");
const controller = require("../controllers/userController");
var router = express.Router();
const middleware = require("../middleware/Middleware");

// Create User
router.post("/signup", middleware.checkAuthentication, controller.signup);

// Login User
router.post("/login", middleware.checkAuthentication, controller.login);

//logout User
router.post("/logout", middleware.checkAuthentication, controller.logout);

module.exports = router;
