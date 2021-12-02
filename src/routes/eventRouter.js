var express = require("express");
const controller = require("../controllers/eventController");
var router = express.Router();

// Create Event
router.post("/", controller.create);

// Get all Events
router.get("/", controller.findAll);

// Get Event
router.get("/:id", controller.findOne);

// Update Event
router.put("/:id", controller.update);

// Delete Event
router.delete("/:id", controller.delete);
