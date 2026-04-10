import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/* ================= Admin Login ================= */

router.post("/login", (req, res) => {

  try {

    const { email, password } = req.body;

    const defaultEmail = "admin123@gmail.com";
    const defaultPassword = "1234";

    /* Check if fields exist */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    /* Remove spaces */

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    console.log("Login Attempt:", cleanEmail, cleanPassword);

    /* Check credentials */

    if (cleanEmail === defaultEmail && cleanPassword === defaultPassword) {

      const token = jwt.sign(
        { role: "admin", email: defaultEmail },
        process.env.JWT_SECRET || "secret123",
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "Admin login successful",
        token,
        admin: {
          email: defaultEmail
        }
      });

    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });

  } catch (error) {

    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

});

export default router;