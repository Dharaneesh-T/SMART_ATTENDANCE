import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

/* ===== Routes ===== */
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportRoutes from "./routes/report.js";
import studentProfileRoutes from "./routes/studentProfile.js";
import scheduleRoutes from "./routes/schedule.js";

dotenv.config();

const app = express();

/* ================= Middleware ================= */

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

app.get("/favicon.ico", (req, res) => res.status(204).end());

/* ================= Routes ================= */

console.log("📌 Registering API Routes...");

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/schedule", scheduleRoutes);

/* ================= Health ================= */

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Attendance API Running 🚀"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API working correctly"
  });
});

/* ================= 404 ================= */

app.use((req, res) => {
  console.log("❌ 404:", req.originalUrl);
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ================= ERROR ================= */

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

import os from "os";

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

const startServer = async () => {
  try {

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("==================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
      console.log(`🌐 http://${getLocalIp()}:${PORT} (Network)`);
      console.log("==================================");
    });

  } catch (error) {
    console.error("❌ Failed:", error);
    process.exit(1);
  }
};

startServer();