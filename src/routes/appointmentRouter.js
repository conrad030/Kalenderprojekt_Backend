var express = require("express");
const controller = require("../controllers/appointmentController");
var router = express.Router();

// Create Appointment
router.post("/", controller.create);

// Get all Appointment
router.get("/", controller.findAll);

// Update Appointment
router.put("/:id", controller.update);

// Delete Appointment
router.delete("/:id", controller.delete);

module.exports = router;
