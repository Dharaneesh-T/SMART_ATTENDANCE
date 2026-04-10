import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../config.js";

function Attendance() {

  const location = useLocation();

useEffect(() => {

  const params = new URLSearchParams(location.search);

  const subjectParam = params.get("subject");
  const dateParam = params.get("date");

  if(subjectParam) setSubject(subjectParam);
  if(dateParam) setDate(dateParam);

}, [location]);
  
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const STUDENT_API = `${BASE_URL}/api/students`;
  const ATTENDANCE_API = `${BASE_URL}/api/attendance`;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  /* ================= Load Students ================= */

  useEffect(() => {

    if (!token) {
      navigate("/");
      return;
    }

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const res = await axios.get(STUDENT_API, { headers });

      /* FIX: ensure students is always an array */

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.students || [];

      setStudents(data);

    } catch (error) {

      console.error("Error loading students:", error);

      if (error.response?.status === 401) {

        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/");

      }

    }

  };

  /* ================= Mark Attendance ================= */

  const markAttendance = (id, status) => {

    if (!subject) {
      alert("Please select subject first");
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [id]: status
    }));

  };

  /* ================= Mark All ================= */

  const markAll = (status) => {

    if (!subject) {
      alert("Please select subject first");
      return;
    }

    const updated = {};

    students.forEach((s) => {
      updated[s.studentId] = status;
    });

    setAttendance(updated);

  };

  /* ================= Save Attendance ================= */

  const saveAttendance = async () => {

    if (!subject) {
      alert("Please select a subject");
      return;
    }

    if (Object.keys(attendance).length === 0) {
      alert("Please mark attendance first");
      return;
    }

    try {

      setLoading(true);

      const requests = Object.keys(attendance).map((studentId) => {

        return axios.post(
          `${ATTENDANCE_API}/add`,
          {
            studentId,
            subject,
            date,
            status: attendance[studentId]
          },
          { headers }
        );

      });

      await Promise.all(requests);

      alert("Attendance saved successfully");

      setAttendance({});
      fetchStudents();

    } catch (error) {

      console.error("Attendance Save Error:", error);
      alert("Error saving attendance");

    } finally {

      setLoading(false);

    }

  };

  /* ================= Edit Attendance ================= */

  const editAttendance = async (id) => {

    const status = prompt("Enter status: Present or Absent");

    if (!status) return;

    try {

      await axios.put(`${ATTENDANCE_API}/update/${id}`, {
        status
      }, { headers });

      alert("Attendance updated");

    } catch (error) {

      console.error("Edit error:", error);

    }

  };

  /* ================= Delete Attendance ================= */

  const deleteAttendance = async (id) => {

    if (!window.confirm("Delete this attendance?")) return;

    try {

      await axios.delete(`${ATTENDANCE_API}/delete/${id}`, { headers });

      alert("Attendance deleted");

    } catch (error) {

      console.error("Delete error:", error);

    }

  };

  return (

    <div className="dashboard-content">

      <h1>Mark Attendance</h1>

      {/* Subject + Date */}

      <div style={{ marginBottom: "20px", display: "flex", gap: "20px" }}>

        <div>

          <label>Subject: </label>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">-- Select Subject --</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="DBMS">DBMS</option>
            <option value="AI">AI</option>
            <option value="Web">Web Development</option>
          </select>

        </div>

        <div>

          <label>Date: </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

        </div>

      </div>

      {/* Quick Buttons */}

      <div style={{ marginBottom: "15px" }}>

        <button onClick={() => markAll("Present")}>
          Mark All Present
        </button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => markAll("Absent")}
        >
          Mark All Absent
        </button>

      </div>

      {/* Students Table */}

      <table className="student-table">

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {!Array.isArray(students) || students.length === 0 ? (

            <tr>
              <td colSpan="5">No students found</td>
            </tr>

          ) : (

            students.map((student) => (

              <tr key={student._id}>

                <td>{student.studentId}</td>
                <td>{student.name}</td>

                <td>
                  <input
                    type="radio"
                    name={student.studentId}
                    checked={attendance[student.studentId] === "Present"}
                    onChange={() =>
                      markAttendance(student.studentId, "Present")
                    }
                  />
                </td>

                <td>
                  <input
                    type="radio"
                    name={student.studentId}
                    checked={attendance[student.studentId] === "Absent"}
                    onChange={() =>
                      markAttendance(student.studentId, "Absent")
                    }
                  />
                </td>

                <td>

                  <button
                    onClick={() => editAttendance(student._id)}
                  >
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => deleteAttendance(student._id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

      <button
        style={{ marginTop: "20px" }}
        onClick={saveAttendance}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Attendance"}
      </button>

    </div>

  );

}

export default Attendance;