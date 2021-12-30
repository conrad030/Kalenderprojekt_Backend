const appointmentService = require("../services/appointmentService");

exports.create = async function (req, res) {
  let {
    groupId,
    title,
    startDate,
    startTime,
    endTime,
    colorCode,
    description,
    repeatInterval,
    maxOccurences,
  } = req.body;
  try {
    let newAppointment = await appointmentService.createAppointment(
      groupId,
      title,
      startDate,
      startTime,
      endTime,
      colorCode,
      description,
      repeatInterval,
      maxOccurences
    );
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: "bad input" });
  }
};

exports.findAll = (req, res) => {};

exports.findOne = (req, res) => {};

exports.update = (req, res) => {};

exports.delete = (req, res) => {};
