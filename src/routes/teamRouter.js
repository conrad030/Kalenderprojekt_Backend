var express = require("express");
const controller = require("../controllers/teamController");
var router = express.Router();

// Create Team
router.post("/", controller.create);

// Add member to Team
router.post("/add/:id", controller.addMember);

// Get all Teams
router.get("/", controller.findAll);

// Get one Team
router.get("/:id", controller.findOne);

// Update Team
router.put("/:id", controller.update);

// Delete Team
router.delete("/:id", controller.delete);

module.exports = router;
