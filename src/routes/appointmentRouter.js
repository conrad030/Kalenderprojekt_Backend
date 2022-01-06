var express = require("express");
const controller = require("../controllers/appointmentController");
var router = express.Router();
const middleware = require("../middleware/Middleware");

// Create Appointment
router.post("/", middleware.checkAuthentication, controller.create);

// Get all Appointments for group
//TODO: Nur wenn man Mitglied in der Gruppe ist
router.get("/groups/:id", middleware.checkAuthentication, controller.findAll);

//Get specific appointment
router.get("/:id", middleware.checkAuthentication, controller.findOne);

// Update Appointment
router.put(
  "/:id",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  controller.update
);

//Add Member to Appointment
router.post(
  "/member",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  controller.addMember
);

//Remove Member from Appointment
router.delete(
  "/member",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  controller.removeMember
);

//Accept appointment invitation
router.post("/member/acceptInvitation/:id", controller.acceptInvitation);

// Delete Appointment
router.delete(
  "/:id",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  controller.delete
);

module.exports = router;
