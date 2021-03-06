var express = require("express");
const controller = require("../controllers/appointmentController");
var router = express.Router();
const middleware = require("../middleware/Middleware");

//Get all Appointments for user
router.get(
  "/",
  middleware.checkAuthentication,
  controller.getAppointmentsForUser
);

// Create Appointment
router.post("/", middleware.checkAuthentication, controller.create);

// Get all Appointments for group
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

//Decline appointment invitation
router.post("/member/declineInvitation/:id", controller.declineInvitation);

//Create exception for appointment
router.post(
  "/createException",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  controller.createException
);

router.post(
  "/uploadFile/:id",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  middleware.upload,
  controller.uploadFile
);

// Delete future Appointments
router.post(
  "/deleteFutureAppointments",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  controller.deleteFutureAppointments
);

// Delete Appointment
router.delete(
  "/:id",
  middleware.checkAuthentication,
  middleware.checkIfAppointmentAdmin,
  controller.delete
);

module.exports = router;
