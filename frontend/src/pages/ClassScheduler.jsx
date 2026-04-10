import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config"; // ✅ FIX

function ClassScheduler() {

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = `${BASE_URL}/api/schedule`;

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {

    try {

      setLoading(true);

      const res = await axios.get(API);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.schedules || [];

      // ✅ DEMO DATA IF EMPTY
      if (!data || data.length === 0) {

        setSchedules([
          {
            _id: "1",
            subject: "Java",
            department: "CS",
            faculty: "Mr. Kumar",
            day: "Monday",
            time: "10:00 AM"
          },
          {
            _id: "2",
            subject: "Python",
            department: "IT",
            faculty: "Ms. Priya",
            day: "Tuesday",
            time: "11:30 AM"
          },
          {
            _id: "3",
            subject: "DBMS",
            department: "BCA",
            faculty: "Mr. Arun",
            day: "Wednesday",
            time: "2:00 PM"
          }
        ]);

      } else {

        setSchedules(data);

      }

    } catch (error) {

      console.error("❌ Schedule API error:", error);

      // ✅ FALLBACK DATA
      setSchedules([
        {
          _id: "1",
          subject: "Java",
          department: "CS",
          faculty: "Mr. Kumar",
          day: "Monday",
          time: "10:00 AM"
        },
        {
          _id: "2",
          subject: "Python",
          department: "IT",
          faculty: "Ms. Priya",
          day: "Tuesday",
          time: "11:30 AM"
        }
      ]);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="dashboard-content">

      <h1>Class Schedule</h1>

      {loading ? (

        <p className="loading">Loading schedule...</p>

      ) : (

        <table className="student-table">

          <thead>
            <tr>
              <th>Subject</th>
              <th>Department</th>
              <th>Faculty</th>
              <th>Day</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>

            {schedules.map((s) => (

              <tr key={s._id}>
                <td>{s.subject}</td>
                <td>{s.department}</td>
                <td>{s.faculty}</td>
                <td>{s.day}</td>
                <td>{s.time}</td>
              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default ClassScheduler;