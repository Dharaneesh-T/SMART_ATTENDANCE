import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/* ================= GET ALL ATTENDANCE ================= */

router.get("/", async (req, res) => {

  try {

    const attendance = await Attendance.find().sort({ date: -1 });

    res.json(attendance);

  } catch (error) {

    console.error("Fetch attendance error:", error);

    res.status(500).json({
      message: "Server error while fetching attendance"
    });

  }

});


/* ================= GET STUDENT ATTENDANCE ================= */

router.get("/:studentId", async (req, res) => {

  try {

    const records = await Attendance.find({
      studentId: req.params.studentId
    }).sort({ date: -1 });

    res.json(records);

  } catch (error) {

    console.error("Fetch student attendance error:", error);

    res.status(500).json({
      message: "Server error while fetching student attendance"
    });

  }

});


/* ================= ADD ATTENDANCE ================= */

router.post("/add", async (req, res) => {

  try {

    const { studentId, subject, date, status } = req.body;

    /* Validation */

    if (!studentId || !subject || !date || !status) {

      return res.status(400).json({
        message: "Student ID, subject, date and status are required"
      });

    }

    if (!["Present", "Absent"].includes(status)) {

      return res.status(400).json({
        message: "Status must be Present or Absent"
      });

    }

    /* Prevent duplicate attendance */

    const existing = await Attendance.findOne({
      studentId,
      subject,
      date
    });

    if (existing) {

      return res.status(400).json({
        message: "Attendance already marked for this subject"
      });

    }

    /* Create attendance */

    const attendance = new Attendance({
      studentId,
      subject,
      date,
      status
    });

    await attendance.save();

    res.json({
      message: "Attendance added successfully",
      attendance
    });

  } catch (error) {

    console.error("Add attendance error:", error);

    res.status(500).json({
      message: "Server error while adding attendance"
    });

  }

});


/* ================= UPDATE ATTENDANCE ================= */

router.put("/update/:id", async (req, res) => {

  try {

    const { status } = req.body;

    if (!["Present", "Absent"].includes(status)) {

      return res.status(400).json({
        message: "Status must be Present or Absent"
      });

    }

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {

      return res.status(404).json({
        message: "Attendance record not found"
      });

    }

    attendance.status = status;

    const updated = await attendance.save();

    res.json({
      message: "Attendance updated successfully",
      attendance: updated
    });

  } catch (error) {

    console.error("Update attendance error:", error);

    res.status(500).json({
      message: "Server error while updating attendance"
    });

  }

});


/* ================= DELETE ATTENDANCE ================= */

router.delete("/delete/:id", async (req, res) => {

  try {

    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {

      return res.status(404).json({
        message: "Attendance record not found"
      });

    }

    res.json({
      message: "Attendance deleted successfully"
    });

  } catch (error) {

    console.error("Delete attendance error:", error);

    res.status(500).json({
      message: "Server error while deleting attendance"
    });

  }

});

export default router;