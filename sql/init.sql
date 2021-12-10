CREATE DATABASE SmartCalendar;

CREATE TABLE SmartCalendar.Group (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  `invitationCode` VARCHAR(5) NOT NULL,
  `password` VARCHAR(45) NULL,
  `colorCode` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.Group_Member (
  `id` INT NOT NULL AUTO_INCREMENT,
  `groupId` INT NOT NULL,
  `userId` INT NOT NULL,
  `isAdmin` TINYINT NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.User (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `isAdmin` TINYINT NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.Team (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `colorCode` VARCHAR(6) NOT NULL,
  `groupid` INT NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.User_Team (
  `id` INT NOT NULL AUTO_INCREMENT,
  `teamId` INT NOT NULL,
  `userId` INT NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.Appointment (
  `id` INT NOT NULL AUTO_INCREMENT,
  `groupId` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NULL,
  `startDate` DATE NOT NULL,
  `startTime` TIME NOT NULL,
  `endTime` TIME NOT NULL,
  `colorCode` VARCHAR(6) NOT NULL,
  `parentId` INT NULL,
  `repeatInterval` INT NULL,
  `maxOccurences` INT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE SmartCalendar.Appointment_Member (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `appointmentId` INT NOT NULL,
  `acceptedInvitation` TINYINT NOT NULL DEFAULT 0,
  `hasReminder` TINYINT NULL DEFAULT 1,
  `isAdmin` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.Appointment_File (
  `id` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(45) NOT NULL,
  `appointmentId` INT NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.Appointment_Exception (
  `id` INT NOT NULL AUTO_INCREMENT,
  `appointmentId` INT NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE SmartCalendar.Message (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NULL,
  `read` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`));

ALTER TABLE SmartCalendar.Appointment
ADD FOREIGN KEY (groupId) REFERENCES SmartCalendar.Group(id),
ADD FOREIGN KEY (parentId) REFERENCES SmartCalendar.Appointment(id);

ALTER TABLE SmartCalendar.Appointment_Exception
ADD FOREIGN KEY (appointmentId) REFERENCES SmartCalendar.Appointment(id);

ALTER TABLE SmartCalendar.Appointment_File
ADD FOREIGN KEY (appointmentId) REFERENCES SmartCalendar.Appointment(id);

ALTER TABLE SmartCalendar.Appointment_Member
ADD FOREIGN KEY (userId) REFERENCES SmartCalendar.User(id),
ADD FOREIGN KEY (appointmentId) REFERENCES SmartCalendar.Appointment(id);

ALTER TABLE SmartCalendar.Message
ADD FOREIGN KEY (userId) REFERENCES SmartCalendar.User(id);

ALTER TABLE SmartCalendar.User_Team
ADD FOREIGN KEY (teamId) REFERENCES SmartCalendar.Team(id),
ADD FOREIGN KEY (userId) REFERENCES SmartCalendar.User(id);

ALTER TABLE SmartCalendar.Team
ADD FOREIGN KEY (groupId) REFERENCES SmartCalendar.Group(id);

ALTER TABLE SmartCalendar.Group_Member
ADD FOREIGN KEY (groupId) REFERENCES SmartCalendar.Group(id),
ADD FOREIGN KEY (userId) REFERENCES SmartCalendar.User(id);