import express from "express";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= STUDENT LOGIN ================= */

router.post("/login", async (req, res) => {

  console.log("Login request:", req.body);

  try {

    let { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID and password are required"
      });
    }

    studentId = studentId.trim();
    password = password.trim();

    /* ---------------- DEFAULT DEMO STUDENT ---------------- */

    if (studentId === "STU001" && password === "1234") {

      const token = jwt.sign(
        { studentId: "STU001", role: "student" },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "Demo student login successful",
        token,
        student: {
          studentId: "STU001",
          name: "Demo Student"
        }
      });
    }

    /* ---------------- DATABASE STUDENT ---------------- */

    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    if (student.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    const token = jwt.sign(
      {
        studentId: student.studentId,
        role: "student"
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      student: {
        id: student._id,
        studentId: student.studentId,
        name: student.name
      }
    });

  } catch (error) {

    console.error("Student Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* ================= GET ALL STUDENTS ================= */

router.get("/", verifyToken, adminOnly, async (req, res) => {

  try {

    const students = await Student
      .find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      students
    });

  } catch (error) {

    console.error("Get Students Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* ================= ADD STUDENT ================= */

router.post("/add", verifyToken, adminOnly, async (req, res) => {

  try {

    let { studentId, name, password } = req.body;

    if (!studentId || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID, name and password required"
      });
    }

    studentId = studentId.trim();
    name = name.trim();
    password = password.trim();

    const existingStudent = await Student.findOne({ studentId });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Student already exists"
      });
    }

    const newStudent = new Student({
      studentId,
      name,
      password
    });

    await newStudent.save();

    console.log("Student created:", studentId);

    res.json({
      success: true,
      message: "Student added successfully",
      student: {
        id: newStudent._id,
        studentId: newStudent.studentId,
        name: newStudent.name
      }
    });

  } catch (error) {

    console.error("Add Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* ================= DELETE STUDENT ================= */

router.delete("/:id", verifyToken, adminOnly, async (req, res) => {

  try {

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (error) {

    console.error("Delete Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});


/* ================= UPDATE STUDENT ================= */

router.put("/:id", verifyToken, adminOnly, async (req, res) => {

  try {

    const { name } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent
    });

  } catch (error) {

    console.error("Update Student Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

export default router;