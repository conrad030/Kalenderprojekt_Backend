const appointmentService = require("../services/appointmentService");

function checkAuthentication(req, res, next) {
  //If user is authenticated
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "unauthenticated" });
  }
}

//Rename to checkIsAdmin
function checkIfAdmin(req, res, next) {
  //If user is authorized
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
}

async function checkIfAppointmentAdmin(req, res, next) {
  let appointmentId =
    req.params.id ?? req.query.appointmentId ?? req.body.appointmentId;
  if (!appointmentId)
    return res.status(400).json({ message: "Missing appointment ID" });

  try {
    let member = await appointmentService.findMemberForAppointment(
      req.session.userId,
      appointmentId
    );
    if (!member || !member.isAdmin)
      return res.status(403).json({ message: "Not authorized" });
    next();
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
}

module.exports = {
  checkAuthentication,
  checkIfAdmin,
  checkIfAppointmentAdmin,
};
