var express = require("express");
const controller = require("../controllers/teamController");
var router = express.Router();
const middleware = require("../middleware/Middleware");

// Create Team
router.post("/", middleware.checkAuthentication, controller.create);

// Add member to Team
router.post(
  "/member/:id",
  middleware.checkAuthentication,
  controller.addMember
);

// Remove member from Team
router.delete(
  "/member/:id",
  middleware.checkAuthentication,
  controller.delMember
);

// Get all Teams
router.get("/", middleware.checkAuthentication, controller.findAll);

// Get one Team
router.get("/:id", middleware.checkAuthentication, controller.findOne);

// Update Team
router.put("/:id", middleware.checkAuthentication, controller.update);

// Delete Team
router.delete("/:id", middleware.checkAuthentication, controller.delete);

module.exports = router;
