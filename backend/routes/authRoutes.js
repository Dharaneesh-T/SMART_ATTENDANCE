import express from "express";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const router = express.Router();

/* ================= ADMIN LOGIN ================= */

router.post("/admin/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required"
    });
  }

  if (email === "admin123@gmail.com" && password === "1234") {

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Admin login successful",
      token
    });
  }

  res.status(401).json({
    message: "Invalid admin credentials"
  });

});


/* ================= STUDENT LOGIN ================= */

router.post("/student/login", async (req, res) => {

  const { studentId, password } = req.body;

  try {

    if (!studentId || !password) {
      return res.status(400).json({
        message: "Student ID and password required"
      });
    }

    const student = await Student.findOne({ studentId });

    if (!student || student.password !== password) {
      return res.status(401).json({
        message: "Invalid student credentials"
      });
    }

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Student login successful",
      token,
      student: {
        studentId: student.studentId,
        name: student.name
      }
    });

  } catch (error) {

    console.error("Student Login Error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

});

export default router;