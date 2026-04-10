import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/* ================= MARK ATTENDANCE ================= */

router.post("/add", async (req, res) => {

  try {

    let { studentId, subject, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: "Student ID, date and status are required"
      });
    }

    studentId = studentId.trim();

    /* Default subject if not sent */

    if (!subject) {
      subject = "General";
    }

    const existingAttendance = await Attendance.findOne({
      studentId,
      date,
      subject
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date"
      });
    }

    const attendance = new Attendance({
      studentId,
      subject,
      date,
      status
    });

    await attendance.save();

    res.json({
      success: true,
      message: "Attendance saved successfully",
      attendance
    });

  } catch (error) {

    console.error("Attendance Save Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* ================= GET ALL ATTENDANCE ================= */

router.get("/", async (req, res) => {

  try {

    const records = await Attendance.find().sort({ date: -1 });

    res.json(records);

  } catch (error) {

    console.error("Fetch Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* ================= GET STUDENT ATTENDANCE ================= */

router.get("/:studentId", async (req, res) => {

  try {

    const { studentId } = req.params;

    const records = await Attendance
      .find({ studentId })
      .sort({ date: -1 });

    res.json(records);

  } catch (error) {

    console.error("Student Attendance Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* ================= SUBJECT ANALYTICS ================= */

router.get("/analytics/:studentId", async (req, res) => {

  try {

    const { studentId } = req.params;

    const records = await Attendance.find({ studentId });

    if (!records.length) {
      return res.json([]);
    }

    const subjects = {};

    records.forEach((r) => {

      if (!subjects[r.subject]) {
        subjects[r.subject] = { present: 0, absent: 0 };
      }

      if (r.status === "Present") {
        subjects[r.subject].present++;
      } else {
        subjects[r.subject].absent++;
      }

    });

    const result = Object.keys(subjects).map((subject) => {

      const total =
        subjects[subject].present + subjects[subject].absent;

      const percentage =
        total === 0
          ? 0
          : ((subjects[subject].present / total) * 100).toFixed(1);

      return {
        subject,
        present: subjects[subject].present,
        absent: subjects[subject].absent,
        percentage
      };

    });

    res.json(result);

  } catch (error) {

    console.error("Subject Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

export default router;