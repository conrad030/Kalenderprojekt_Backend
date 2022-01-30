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

//Find all groups in where the logged in user is member
router.get(
  "/groups",
  middleware.checkAuthentication,
  controller.findGroupsForUser
);

//Get User
router.get("/:id", middleware.checkAuthentication, controller.getUser);

// Update User
router.put("/:id", middleware.checkAuthentication, controller.updateUser);

router.delete("/:id", middleware.checkIfAdmin, controller.deleteUser);

module.exports = router;
