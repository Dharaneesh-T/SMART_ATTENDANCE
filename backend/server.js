import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ✅ FIX: allow frontend URL (IMPORTANT)
app.use(cors({
  origin: "*", // change later to your Vercel URL
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

/* ================= Routes ================= */

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/schedule", scheduleRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

/* ================= Health ================= */

// ✅ IMPORTANT for Render
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API working correctly" });
});

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ================= ERROR ================= */

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

// ✅ FIX: safer IP function
const getLocalIp = () => {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (err) {
    return "localhost";
  }
  return "localhost";
};

const startServer = async () => {
  try {
    console.log("🔄 Connecting to DB...");
    await connectDB();
    console.log("✅ DB Connected");

    app.listen(PORT, () => {
      console.log("==================================");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 http://localhost:${PORT}`);
      console.log(`🌐 http://${getLocalIp()}:${PORT}`);
      console.log("==================================");
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();