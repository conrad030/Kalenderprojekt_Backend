var express = require("express");
const controller = require("../controllers/appointmentController");
var router = express.Router();
const middleware = require("../middleware/Middleware");

// Create Appointment
router.post("/", middleware.checkAuthentication, controller.create);

// Get all Appointments for group
//TODO: Nur wenn man Mitglied in der Gruppe ist
router.get("/:id", middleware.checkAuthentication, controller.findAll);

// Update Appointment
router.put("/:id", middleware.checkAuthentication, controller.update);

// Delete Appointment
router.delete("/:id", middleware.checkAuthentication, controller.delete);

module.exports = router;
