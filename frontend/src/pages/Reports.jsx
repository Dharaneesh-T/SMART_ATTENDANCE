import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../App.css";
import { BASE_URL } from "../config";

function Reports() {

  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");

  const API = `${BASE_URL}/api`;

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [studentsRes, attendanceRes] = await Promise.all([
        axios.get(`${API}/students`, { headers }),
        axios.get(`${API}/attendance`, { headers })
      ]);

      // ✅ SAFE ARRAY HANDLING
      const students = Array.isArray(studentsRes.data)
        ? studentsRes.data
        : studentsRes.data?.students || [];

      const attendance = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : attendanceRes.data?.records || [];

      // ✅ FILTER BY DATE
      const filteredAttendance = date
        ? attendance.filter(a => a.date === date)
        : attendance;

      // ✅ GENERATE REPORT
      const reportData = students.map(student => {

        const records = filteredAttendance.filter(
          a => a.studentId === student.studentId
        );

        const present = records.filter(r => r.status === "Present").length;
        const absent = records.filter(r => r.status === "Absent").length;

        const total = present + absent;

        const percentage =
          total === 0 ? 0 : ((present / total) * 100).toFixed(1);

        return {
          StudentID: student.studentId,
          Name: student.name,
          Present: present,
          Absent: absent,
          Attendance: `${percentage}%`
        };

      });

      setReport(reportData);

    } catch (error) {

      console.error("Report Error:", error);
      alert("Failed to load attendance report");

    } finally {

      setLoading(false);

    }

  };

  /* ================= EXPORT EXCEL ================= */

  const exportExcel = () => {

    if (!report.length) {
      alert("No report data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(report);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    XLSX.writeFile(workbook, "Attendance_Report.xlsx");

  };

  /* ================= EXPORT PDF ================= */

  const exportPDF = () => {

    if (!report.length) {
      alert("No report data to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Attendance Report", 14, 15);

    const tableData = report.map(r => [
      r.StudentID,
      r.Name,
      r.Present,
      r.Absent,
      r.Attendance
    ]);

    autoTable(doc, {
      head: [["Student ID", "Name", "Present", "Absent", "Attendance %"]],
      body: tableData,
      startY: 20
    });

    doc.save("Attendance_Report.pdf");

  };

  return (

    <div className="dashboard-content">

      <h1>Attendance Report</h1>

      {/* Date Filter */}

      <div style={{ marginBottom: "20px" }}>

        <label>Select Date: </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button style={{ marginLeft: "10px" }} onClick={fetchReport}>
          Filter
        </button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => {
            setDate("");
            fetchReport();
          }}
        >
          Reset
        </button>

      </div>

      {/* Export Buttons */}

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>

        <button onClick={exportExcel}>Export Excel</button>
        <button onClick={exportPDF}>Export PDF</button>

      </div>

      {loading ? (

        <p className="loading">Loading report...</p>

      ) : report.length === 0 ? (

        <p>No attendance data available</p>

      ) : (

        <table className="student-table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
            </tr>
          </thead>

          <tbody>

            {report.map((r) => (
              <tr key={r.StudentID}>
                <td>{r.StudentID}</td>
                <td>{r.Name}</td>
                <td>{r.Present}</td>
                <td>{r.Absent}</td>
                <td>{r.Attendance}</td>
              </tr>
            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default Reports;