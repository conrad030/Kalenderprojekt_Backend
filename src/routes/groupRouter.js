var express = require("express");
const controller = require("../controllers/groupController");
var router = express.Router();
const middleware = require("../middleware/Middleware");

// Create Group
router.post("/create", middleware.checkAuthentication, controller.create);

// Get all Groups
router.get("/", middleware.checkAuthentication, controller.findAll);

// Get invitation code
/**
 * ? Should this be a POST instead?
 */
router.get("/invitation", middleware.checkAuthentication, controller.joinGroup);

// Get Group
router.get("/:id", middleware.checkAuthentication, controller.findOne);

// Get all Teams of Group
router.get(
  "/teams/:id",
  middleware.checkAuthentication,
  controller.findAllTeams
);

// Get Appointment
router.get(
  "/appointments/:id",
  middleware.checkAuthentication,
  controller.findOne
);

// Update Group
router.put("/:id", middleware.checkAuthentication, controller.update);

// Delete Group
router.delete("/:id", middleware.checkAuthentication, controller.delete);

module.exports = router;
