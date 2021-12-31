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
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findAll = async function (req, res) {
  try {
    let appointments = await appointmentService.getAppointmentsForGroup(
      req.params.id
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findOne = (req, res) => {};

exports.update = async function (req, res) {
  try {
    let {
      title,
      startDate,
      startTime,
      endTime,
      colorCode,
      description,
      repeatInterval,
      maxOccurences,
    } = req.body;
    await appointmentService.updateAppointment(
      title,
      startDate,
      startTime,
      endTime,
      colorCode,
      description,
      repeatInterval,
      maxOccurences,
      req.params.id
    );
    res.status(200).json({ message: "Updated appointment" });
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.delete = (req, res) => {};
