import jwt from "jsonwebtoken";

/* ================= VERIFY TOKEN ================= */

export const verifyToken = (req, res, next) => {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided"
    });
  }

  // Expect format: Bearer TOKEN
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format"
    });
  }

  const token = parts[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error("Token verification error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });

  }

};


/* ================= ADMIN ACCESS ================= */

export const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }

  next();

};


/* ================= STUDENT ACCESS ================= */

export const studentOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request"
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Student access only"
    });
  }

  next();

};