const db = require("../database/Database").initDb();
const { ServiceError } = require("../errors");

exports.createAppointment = async function (
  groupId,
  title,
  startDate,
  startTime,
  endTime,
  colorCode,
  description,
  repeatInterval,
  maxOccurences
) {
  if (groupId && title && startDate && startTime && endTime && colorCode) {
    let argumentsArray = Array.from(arguments).filter((argument) => {
      return argument != undefined;
    });

    let query = `
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
      let response = await db.query(query, argumentsArray);
      return response[0];
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
    return result[0];
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
    await db.query(query, argumentsArray);
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
  return appointments[0];
};
