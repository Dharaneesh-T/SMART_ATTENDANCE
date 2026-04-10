import express from "express";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:studentId", verifyToken, async (req, res) => {

  try {

    const student = await Student.findOne({
      studentId: req.params.studentId
    }).select("-password");

    const attendance = await Attendance.find({
      studentId: req.params.studentId
    });

    res.json({
      student,
      attendance
    });

  } catch (error) {

    console.error("Student Profile Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

export default router;