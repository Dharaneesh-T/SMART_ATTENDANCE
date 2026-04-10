// ================= BASE CONFIG =================

// 👉 Automatically gets the current IP or localhost depending on how you access the app locally
const LOCAL_IP = window.location.hostname;

// ================= API URL =================

// 🔥 Uses Vercel environment variable in Production, otherwise falls back to local IP logic
export const BASE_URL = import.meta.env.VITE_API_URL || `http://${LOCAL_IP}:5000`;

// ================= FRONTEND URL (for QR) =================

// ✅ Uses Vercel environment variable in Production, otherwise falls back to local Vite port
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || `http://${LOCAL_IP}:5173`;