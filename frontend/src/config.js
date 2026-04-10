// ================= BASE CONFIG =================

// 👉 Automatically gets the current IP or localhost depending on how you access the app
const LOCAL_IP = window.location.hostname;

// ================= API URL =================

// 🔥 Automatically works for both mobile + laptop
export const BASE_URL = `http://${LOCAL_IP}:5000`;

// ================= FRONTEND URL (for QR) =================

// ✅ Always use correct frontend port
export const FRONTEND_URL = `http://${LOCAL_IP}:5173`;