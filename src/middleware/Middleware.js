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
function checkAuthorization(req, res, next) {
  //If user is authorized
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
}

async function checkIfAppointmentAdmin(req, res, next) {
  let appointmentId = req.params.id ?? req.query.appointmentId;
  if (!appointmentId) return res.status({ message: "Missing appointment ID" });

  try {
    let member = await appointmentService.findMemberForAppointment(
      req.session.userId,
      appointmentId
    );
    if (!member.isAdmin)
      return res.status(403).json({ message: "Not authorized" });
    next();
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
}

module.exports = {
  checkAuthentication,
  checkAuthorization,
  checkIfAppointmentAdmin,
};
