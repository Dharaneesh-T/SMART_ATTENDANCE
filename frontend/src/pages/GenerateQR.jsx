import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../App.css";
import { FRONTEND_URL } from "../config";

function GenerateQR() {

  const [subject, setSubject] = useState("");

  const date = new Date().toISOString().split("T")[0];

  // ✅ Always use IP-based URL (from config)
  const qrValue = subject
    ? `${FRONTEND_URL}/attendance?subject=${encodeURIComponent(subject)}&date=${date}`
    : "";

  return (

    <div className="dashboard-content">

      <h1>Generate Attendance QR</h1>

      {/* Subject Dropdown */}
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{ padding: "10px", marginTop: "10px" }}
      >
        <option value="">Select Subject</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
        <option value="DBMS">DBMS</option>
        <option value="AI">AI</option>
        <option value="Web Development">Web Development</option>
      </select>

      {/* QR Section */}
      {subject && (

        <div style={{ marginTop: "30px", textAlign: "center" }}>

          <QRCodeCanvas value={qrValue} size={220} />

          <p style={{ marginTop: "10px", fontWeight: "bold" }}>
            📱 Scan this QR to open attendance
          </p>

          {/* Debug URL */}
          <div style={{
            marginTop: "10px",
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "5px",
            wordBreak: "break-all"
          }}>
            <small>
              <b>QR URL:</b><br />
              {qrValue}
            </small>
          </div>

        </div>

      )}

    </div>
  );
}

export default GenerateQR;