import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  const attendance = new Attendance(req.body);

  await attendance.save();

  res.json(attendance);
};

export const getAttendance = async (req, res) => {
  const records = await Attendance.find();

  res.json(records);
};