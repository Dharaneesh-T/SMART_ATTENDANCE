import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import { BASE_URL } from "../config.js";

function ScanQR() {

  const [result, setResult] = useState("");

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {

        try {

          const qr = JSON.parse(decodedText);

          await axios.post(`${BASE_URL}/api/attendance/add`, {
            studentId,
            subject: qr.subject,
            date: qr.date,
            status: "Present"
          });

          setResult("✅ Attendance marked successfully");

          scanner.clear();

        } catch (err) {

          console.error("QR Scan Error:", err);
          setResult("❌ Attendance already marked or invalid QR");

        }

      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, []);

  return (

    <div className="dashboard-content">

      <h2>Scan QR for Attendance</h2>

      <div
        id="qr-reader"
        style={{ width: "300px", margin: "auto" }}
      ></div>

      <p style={{ marginTop: "20px", fontWeight: "bold" }}>
        {result}
      </p>

    </div>

  );

}

export default ScanQR;