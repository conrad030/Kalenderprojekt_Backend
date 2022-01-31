const appointmentService = require("../services/appointmentService");
const groupService = require("../services/groupService");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

exports.getAppointmentsForUser = async function (req, res) {
  let inFuture = req.query.inFuture ?? false;
  try {
    let appointments = await appointmentService.getAppointmentsForUser(
      req.session.userId,
      inFuture
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.create = async function (req, res) {
  let {
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
  } = req.body;
  try {
    if (!(await groupService.isGroupMember(req.session.userId, groupId)))
      return res.status(403).json({ message: "User is no member of group" });
    let newAppointment = await appointmentService.createAppointment(
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
      req.session.userId
    );
    res.status(201).json(newAppointment);
  } catch (error) {
    console.log("Fehler:", error);
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.findAll = async function (req, res) {
  if (!(await groupService.isGroupMember(req.session.userId, req.params.id)))
    return res.status(403).json({ message: "User is no member of group" });
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
      if (
        !(await groupService.isGroupMember(
          req.session.userId,
          appointment.groupId
        ))
      )
        return res.status(403).json({ message: "User is no member of group" });
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

exports.removeMember = async function (req, res) {
  try {
    await appointmentService.removeMember(
      req.query.appointmentId,
      req.query.userId
    );
    res.status(200).json({ message: "Member removed" });
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.acceptInvitation = async function (req, res) {
  try {
    await appointmentService.acceptInvitation(
      req.params.id,
      req.session.userId
    );
    res.status(200).json({ message: "Accepted invitation" });
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.createException = async function (req, res) {
  let { appointmentId, date } = req.body;
  try {
    let appointment = await appointmentService.createException(
      appointmentId,
      date,
      req.session.userId
    );
    res.status(201).json(appointment);
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
};

exports.uploadFile = async function (req, res) {
  try {
    if (req.file) {
      let splittedFile = req.file.originalname.split(".");
      let fileName = splittedFile[splittedFile.length - 2];
      let params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: Date.now() + fileName,
        Body: req.file.buffer,
      };
      s3.upload(params, function (error, data) {
        if (error) {
          res.status(500).json({ message: error });
        } else {
          appointmentService
            .addFile(req.params.id, data.Location)
            .then((appointment) => {
              res.status(200).json(appointment);
            })
            .catch((error) => {
              res.status(error.statusCode).json({ message: error.message });
            });
        }
      });
    } else {
      res.status(403).json({ message: "There is no file" });
    }
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({ message: error.message });
  }
};
