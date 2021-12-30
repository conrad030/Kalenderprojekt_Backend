const db = require("../database/Database").initDb();

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
    let query = `
    INSERT INTO SmartCalendar.Appointment (groupId, title, startDate, startTime, endTime, colorCode${
      description ? ", description" : ""
    }${repeatInterval ? ", repeatInterval" : ""}${
      maxOccurences ? ", maxOccurences" : ""
    })
    VALUES (\'${groupId}\', \'${title}\', \'${startDate}\', \'${startTime}\', \'${endTime}\', \'${colorCode}\'${
      description ? `, \'${description}\'` : ""
    }${repeatInterval ? `, \'${repeatInterval}\'` : ""}${
      maxOccurences ? `, \'${maxOccurences}\'` : ""
    });
    `;
    let response = await db.query(query);
    console.log("Geklappt. Hier:");
    console.log(response);
  } else {
    throw new Error("Missing input");
  }
};
