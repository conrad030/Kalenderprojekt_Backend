const db = require("../database/Database").initDb();
const { ServiceError } = require("../errors");
const userService = require("./userService");
const groupService = require("./groupService");

const findMembersForAppointment = async function (id) {
  if (!id) throw new Error("missing arguments");
  let query = `
  SELECT SmartCalendar.User.id, username, email, SmartCalendar.User.isAdmin
  FROM SmartCalendar.User user, SmartCalendar.Appointment_Member member
  WHERE user.id = member.userId
  AND member.appointmentId = ?;`;
  try {
    let [users, _] = await db.query(query, [id]);
    return users;
  } catch (error) {
    throw new ServiceError("Internal server error", 500);
  }
};

exports.createAppointment = async function (
  groupId,
  title,
  startDate,
  startTime,
  endTime,
  colorCode,
  description,
  repeatInterval,
  maxOccurences,
  userId
) {
  if (!(await groupService.findOne(groupId)))
    throw new ServiceError("Group not found", 404);

  if (groupId && title && startDate && startTime && endTime && colorCode) {
    let argumentsArray = Array.from(arguments)
      .slice(0, Array.from(arguments).length - 1)
      .filter((argument) => {
        return argument != undefined;
      });

    let appointmentQuery = `
    INSERT INTO SmartCalendar.Appointment (groupId, title, startDate, startTime, endTime, colorCode${
      description ? ", description" : ""
    }${repeatInterval ? ", repeatInterval" : ""}${
      maxOccurences ? ", maxOccurences" : ""
    })
    VALUES (${argumentsArray
      .map((_) => {
        return "?";
      })
      .join(", ")});
    `;
    try {
      let results = await db.query(appointmentQuery, argumentsArray);
      var newAppointment = await this.findOne(results[0].insertId);
      newAppointment = await this.addMember(
        newAppointment.id,
        userId,
        true,
        true,
        true
      );
      return newAppointment;
    } catch (error) {
      console.log(error);
      throw new ServiceError("Internal Server Error", 500);
    }
  } else {
    throw new ServiceError("Missing input", 400);
  }
};

exports.getAppointmentsForGroup = async function (groupId) {
  let query = `
  SELECT * from SmartCalendar.Appointment
  WHERE groupId = ?
  `;
  try {
    let result = await db.query(query, [groupId]);
    let appointments = result[0];
    for (var i = 0; i < appointments.length; i++) {
      let members = await findMembersForAppointment(appointments[i].id);
      appointments[i].members = members;
    }
    return appointments;
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};

//Muss noch getestet werden
exports.updateAppointment = async function (
  title,
  startDate,
  startTime,
  endTime,
  colorCode,
  description,
  repeatInterval,
  maxOccurences,
  id
) {
  let keysArray = [
    "title",
    "startDate",
    "startTime",
    "endTime",
    "colorCode",
    "description",
    "repeatInterval",
    "maxOccurences",
  ];
  var filteredKeys = [];
  for (var i = 0; i < keysArray.length; i++) {
    if (Array.from(arguments)[i] !== undefined) {
      filteredKeys = [...filteredKeys, keysArray[i]];
    }
  }

  let argumentsArray = Array.from(arguments).filter((argument) => {
    return argument !== undefined;
  });

  var appointment = await this.findOne(id);
  if (!appointment) throw new ServiceError("Appointment not found", 404);

  let query = `
  UPDATE SmartCalendar.Appointment SET 
  ${filteredKeys
    .map((key) => {
      return key + " = ?";
    })
    .join(", ")}
  WHERE id = ?;`;
  try {
    let results = await db.query(query, argumentsArray);
    let updatedAppointment = await this.findOne(id);
    let members = await findMembersForAppointment(updatedAppointment.id);
    updatedAppointment.members = members;
    return updatedAppointment;
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};

//On Delete Cascade noch hinzufügen
exports.deleteAppointment = async function (id) {
  var appointment = await this.findOne(id);
  if (!appointment) throw new ServiceError("Appointment not found", 404);
  let members = await findMembersForAppointment(appointment.id);
  appointment.members = members;
  let query = `
  DELETE FROM SmartCalendar.Appointment
  WHERE id = ?;
  `;
  try {
    await db.query(query, [id]);
    return appointment;
  } catch (error) {
    console.log(error);
    throw new ServiceError("Internal Server Error", 500);
  }
};

exports.findOne = async function (id) {
  if (!id) throw new Error("missing arguments");
  let query = `
  SELECT * FROM SmartCalendar.Appointment
  WHERE id = ?;`;
  let [appointments, _] = await db.query(query, [id]);
  //No appointments found
  if (appointments.length === 0) return;
  let members = await findMembersForAppointment(id);
  appointments[0].members = members;
  return appointments[0];
};

//Nur wenn der User vorher noch nicht drin war
exports.addMember = async function (
  appointmentId,
  userId,
  acceptedInvitation = false,
  hasReminder = false,
  isAdmin = false
) {
  if (!appointmentId || !userId)
    throw new ServiceError("Missing arguments in query", 400);
  let appointment = await this.findOne(appointmentId);
  if (!appointment) throw new ServiceError("Appointment not found", 404);
  let user = await userService.findOne(userId);
  if (!user) throw new ServiceError("User not found", 404);
  let appointmentMemberQuery = `
    INSERT INTO SmartCalendar.Appointment_Member (userId, appointmentId, acceptedInvitation, hasReminder, isAdmin)
    VALUES (?, ?, ?, ?, ?);
    `;
  try {
    await db.query(appointmentMemberQuery, [
      userId,
      appointmentId,
      acceptedInvitation,
      hasReminder,
      isAdmin,
    ]);
    let members = await findMembersForAppointment(appointmentId);
    appointment.members = members;
    return appointment;
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};
