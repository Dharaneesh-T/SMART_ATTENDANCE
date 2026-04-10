import express from "express";
import XLSX from "xlsx";
import Attendance from "../models/Attendance.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/export", verifyToken, adminOnly, async (req, res) => {

  try {

    const attendance = await Attendance.find();

    const data = attendance.map((a) => ({
      studentId: a.studentId,
      date: a.date,
      status: a.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx"
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance-report.xlsx"
    );

    res.send(buffer);

  } catch (error) {

    console.error("Export Error:", error);

    res.status(500).json({
      message: "Failed to export report"
    });

  }

});

export default router;