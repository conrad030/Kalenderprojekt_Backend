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
      maxOccurences,
      req.session.userId
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

exports.findOne = async function (req, res) {
  try {
    let appointment = await appointmentService.findOne(req.params.id);
    if (appointment !== undefined) {
      res.status(200).json(appointment);
    } else {
      res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

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
    let updatedAppointment = await appointmentService.updateAppointment(
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
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.delete = async function (req, res) {
  try {
    let deletedAppointment = await appointmentService.deleteAppointment(
      req.params.id
    );
    res.status(200).json(deletedAppointment);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.addMember = async function (req, res) {
  try {
    let updatedAppointment = await appointmentService.addMember(
      req.query.appointmentId,
      req.query.userId
    );
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};
