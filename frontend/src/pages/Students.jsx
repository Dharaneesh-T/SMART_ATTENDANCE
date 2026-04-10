import { useState, useEffect } from "react";
import API from "../services/api";
import "../App.css";

function Students() {

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.students || [];

      setStudents(data);

    } catch (error) {

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        window.location.href = "/";
      }

    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (e) => {

    e.preventDefault();

    if (!studentId.trim() || !name.trim()) {
      alert("Please enter student ID and name");
      return;
    }

    try {

      await API.post("/students/add", {
        studentId: studentId.trim(),
        name: name.trim(),
        password: "1234"
      });

      alert("Student added successfully");

      setName("");
      setStudentId("");

      fetchStudents();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to add student");
    }

  };

  const deleteStudent = async (id) => {

    if (!window.confirm("Delete this student?")) return;

    try {

      await API.delete(`/students/${id}`);
      alert("Student deleted successfully");

      fetchStudents();

    } catch (error) {
      alert("Failed to delete student");
    }

  };

  const filteredStudents = Array.isArray(students)
    ? students.filter((s) =>
        (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.studentId || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (

    <div className="dashboard-content">

      {/* 🔥 GLASS WRAPPER */}
      <div className="students-wrapper">

        <h1 className="students-title">Students</h1>

        {/* ADD STUDENT */}
        <form className="student-form" onSubmit={addStudent}>

          <input
            type="text"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button type="submit">
            Add Student
          </button>

        </form>

        {/* 🔍 SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        {loading ? (

          <p className="loading">Loading students...</p>

        ) : (

          <table className="student-table">

            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.length === 0 ? (

                <tr>
                  <td colSpan="3">No students found</td>
                </tr>

              ) : (

                filteredStudents.map((s) => (
                  <tr key={s._id}>
                    <td>{s.studentId}</td>
                    <td>{s.name}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteStudent(s._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

}

export default Students;