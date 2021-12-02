var express = require("express");
const controller = require("../controllers/groupController");
var router = express.Router();

// Create Group
router.post("/create", controller.create);

// Get all Groups
router.get("/", controller.findAll);

// Get Group
router.get("/:id", controller.findOne);

// Get invitation code
router.get("/invitation/:code", controller.findInvCode);

// Update Group
router.put("/:id", controller.update);

// Delete Group
router.delete("/:id", controller.delete);
