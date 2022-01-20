const db = require("../database/Database").initDb();
const { ServiceError } = require("../errors");
const userService = require("./userService");
const groupService = require("./groupService");

exports.getAppointmentsForUser = async function (userId) {
  let query = `
  SELECT appointment.*
  FROM SmartCalendar.Appointment appointment, SmartCalendar.Appointment_Member member
  WHERE appointment.id = member.appointmentId
  AND member.acceptedInvitation = true
  AND member.userId = ?;
  `;
  try {
    let result = await db.query(query, [userId]);
    let appointments = result[0];
    for (var i = 0; i < appointments.length; i++) {
      let members = await findMembersForAppointment(appointments[i].id);
      appointments[i].members = members;
      let exceptions = await findExceptionsForAppointment(appointments[i].id);
      appointments[i].exceptions = exceptions;
      let files = await findFilesForAppointment(appointments[i].id);
      appointments[i].files = files;
    }
    return appointments;
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};

exports.createAppointment = async function (
  groupId,
  title,
  startDate,
  startTime,
  endTime,
  colorCode,
  parentId,
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
      parentId ? ", parentId" : ""
    }${description ? ", description" : ""}${
      repeatInterval ? ", repeatInterval" : ""
    }${maxOccurences ? ", maxOccurences" : ""})
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
      newAppointment.exceptions = [];
      newAppointment.files = [];
      return newAppointment;
    } catch (error) {
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
      let exceptions = await findExceptionsForAppointment(appointments[i].id);
      appointments[i].exceptions = exceptions;
      let files = await findFilesForAppointment(appointments[i].id);
      appointments[i].files = files;
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
    return updatedAppointment;
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};

//On Delete Cascade noch hinzufügen
exports.deleteAppointment = async function (id) {
  var appointment = await this.findOne(id);
  if (!appointment) throw new ServiceError("Appointment not found", 404);
  let query = `
  DELETE FROM SmartCalendar.Appointment
  WHERE id = ?;
  `;
  try {
    await db.query(query, [id]);
    return appointment;
  } catch (error) {
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
  let exceptions = await findExceptionsForAppointment(id);
  appointments[0].exceptions = exceptions;
  let files = await findFilesForAppointment(id);
  appointments[0].files = files;
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
  if (await this.findMemberForAppointment(userId, appointmentId))
    throw new ServiceError("User is already member", 400);
  let appointment = await this.findOne(appointmentId);
  if (!appointment) throw new ServiceError("Appointment not found", 404);
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

exports.removeMember = async function (appointmentId, userId) {
  if (!appointmentId || !userId)
    throw new ServiceError("Missing arguments in query", 400);
  let member = await this.findMemberForAppointment(userId, appointmentId);
  if (!member) {
    throw new ServiceError("User is no member of appointment", 400);
  } else if (member.isAdmin) {
    throw new ServiceError("Appointment admin can't be removed", 400);
  }
  let query = `
  DELETE FROM SmartCalendar.Appointment_Member
  WHERE appointmentId = ?
  AND userId = ?;
  `;
  try {
    await db.query(query, [appointmentId, userId]);
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};

exports.acceptInvitation = async function (appointmentId, userId) {
  let appointment = await this.findOne(appointmentId);
  if (!appointment) throw new ServiceError("Appointment not found", 404);
  let user = await userService.findOne(userId);
  if (!user) throw new ServiceError("User not found", 404);
  let member = await this.findMemberForAppointment(userId, appointmentId);
  if (!member) {
    throw new ServiceError("User is no member of appointment", 404);
  } else if (member.acceptedInvitation) {
    throw new ServiceError("User already accepted invitation", 400);
  }

  let query = `
  UPDATE SmartCalendar.Appointment_Member SET 
  acceptedInvitation = true
  WHERE userId = ?
  AND appointmentId = ?;
  `;
  try {
    await db.query(query, [userId, appointmentId]);
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};

exports.createException = async function (appointmentId, date, userId) {
  let appointment = await this.findOne(appointmentId);
  if (!appointment) throw new ServiceError("Appointment not found", 404);
  let query = `
  INSERT INTO SmartCalendar.Appointment_Exception (appointmentId, date)
  VALUES (?, ?);
  `;
  try {
    let result = await db.query(query, [appointmentId, date]);
    let exceptions = await findExceptionsForAppointment(appointmentId);
    appointment.exceptions = exceptions;
    return appointment;
  } catch (error) {
    throw new ServiceError("Internal Server Error", 500);
  }
};

const findMembersForAppointment = async function (appointmentId) {
  if (!appointmentId) throw new Error("missing arguments");
  let query = `
  SELECT user.id, user.username, user.email, member.isAdmin, member.acceptedInvitation
  FROM SmartCalendar.User user, SmartCalendar.Appointment_Member member
  WHERE user.id = member.userId
  AND member.appointmentId = ?;`;
  try {
    let [users, _] = await db.query(query, [appointmentId]);
    for (var i = 0; i < users.length; i++) {
      users[i].acceptedInvitation = users[i].acceptedInvitation === 1;
      users[i].isAdmin = users[i].isAdmin === 1;
    }
    return users;
  } catch (error) {
    throw new ServiceError("Internal server error", 500);
  }
};

const findExceptionsForAppointment = async function (appointmentId) {
  if (!appointmentId) throw new Error("missing arguments");
  let query = `
  SELECT date FROM SmartCalendar.Appointment_Exception
  WHERE appointmentId = ?;`;
  try {
    let [exceptions, _] = await db.query(query, [appointmentId]);
    return exceptions;
  } catch (error) {
    throw new ServiceError("Internal server error", 500);
  }
};

exports.findMemberForAppointment = async function (userId, appointmentId) {
  if (!appointmentId || !userId) throw new Error("Missing arguments");
  let appointment = await this.findOne(appointmentId);
  if (!appointment) throw new ServiceError("Appointment not found", 404);
  let user = await userService.findOne(userId);
  if (!user) throw new ServiceError("User not found", 404);
  let query = `
  SELECT * FROM SmartCalendar.Appointment_Member
  WHERE userId = ?
  AND appointmentId = ?;`;
  let [members, _] = await db.query(query, [userId, appointmentId]);
  //No members found
  if (members.length === 0) return;
  members[0].acceptedInvitation = members[0].acceptedInvitation === 1;
  members[0].isAdmin = members[0].isAdmin === 1;
  return members[0];
};

exports.addFile = async function (appointmentId, fileLocation) {
  let query = `
  INSERT INTO SmartCalendar.Appointment_File (appointmentId, url)
  VALUES (?, ?);
  `;
  try {
    console.log(fileLocation.length);
    await db.query(query, [appointmentId, fileLocation]);
    let appointment = await this.findOne(appointmentId);
    return appointment;
  } catch (error) {
    console.log(error);
    throw new ServiceError("Internal server error", 500);
  }
};

const findFilesForAppointment = async function (appointmentId) {
  if (!appointmentId) throw new Error("missing arguments");
  let query = `
  SELECT url FROM SmartCalendar.Appointment_File
  WHERE appointmentId = ?;`;
  try {
    let [files, _] = await db.query(query, [appointmentId]);
    return files;
  } catch (error) {
    throw new ServiceError("Internal server error", 500);
  }
};
