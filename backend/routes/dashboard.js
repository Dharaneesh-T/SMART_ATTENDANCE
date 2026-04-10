import express from "express";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, adminOnly, async (req, res) => {

  try {

    const totalStudents = await Student.countDocuments();

    const totalAttendance = await Attendance.countDocuments();

    const today = new Date().toISOString().split("T")[0];

    const presentToday = await Attendance.countDocuments({
      date: today,
      status: "Present"
    });

    const presentCount = await Attendance.countDocuments({
      status: "Present"
    });

    const averageAttendance =
      totalAttendance === 0
        ? 0
        : ((presentCount / totalAttendance) * 100).toFixed(1);

    res.json({
      totalStudents,
      totalAttendance,
      presentToday,
      averageAttendance
    });

  } catch (error) {

    console.error("Dashboard Stats Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

export default router;