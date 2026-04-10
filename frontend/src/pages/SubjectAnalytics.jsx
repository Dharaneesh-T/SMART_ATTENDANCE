import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { BASE_URL } from "../config";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function SubjectAnalytics() {

  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");

  const API = `${BASE_URL}/api/attendance`;

  useEffect(() => {

    if (!studentId || !token) {
      loadDemoData();
      setLoading(false);
      return;
    }

    fetchData();

  }, []);

  const loadDemoData = () => {
    setChartData({
      labels: ["Java", "Python", "DBMS", "AI"],
      datasets: [
        {
          label: "Attendance %",
          data: [85, 72, 90, 65],
          backgroundColor: "rgba(79,195,247,0.7)", // 🔥 neon color
          borderRadius: 8
        }
      ]
    });
  };

  const fetchData = async () => {

    try {

      setLoading(true);

      const res = await axios.get(`${API}/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const records = Array.isArray(res.data)
        ? res.data
        : res.data?.records || [];

      if (!records.length) {
        loadDemoData();
        return;
      }

      const subjects = {};

      records.forEach((r) => {

        const subject = r.subject || "Unknown";

        if (!subjects[subject]) {
          subjects[subject] = { present: 0, total: 0 };
        }

        subjects[subject].total++;

        if (r.status === "Present") {
          subjects[subject].present++;
        }

      });

      const labels = Object.keys(subjects);

      const percentages = labels.map((s) => {
        const p = subjects[s].present;
        const t = subjects[s].total;
        return t === 0 ? 0 : Number(((p / t) * 100).toFixed(1));
      });

      setChartData({
        labels,
        datasets: [
          {
            label: "Attendance %",
            data: percentages,
            backgroundColor: "rgba(79,195,247,0.7)", // 🔥 neon blue
            borderRadius: 8
          }
        ]
      });

    } catch (error) {

      console.error("Error:", error);
      loadDemoData();

    } finally {

      setLoading(false);

    }

  };

  /* 🔥 CHART OPTIONS (FIX VISIBILITY) */
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff" // ✅ visible legend
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff" // ✅ subject names visible
        },
        grid: {
          color: "rgba(255,255,255,0.1)"
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "#ffffff" // ✅ numbers visible
        },
        grid: {
          color: "rgba(255,255,255,0.1)"
        }
      }
    }
  };

  return (

    <div className="dashboard-content">

      <div className="subject-wrapper">

        <h1 className="subject-title">
          Subject Attendance Analytics
        </h1>

        {loading ? (

          <p className="loading">Loading analytics...</p>

        ) : chartData ? (

          <div className="subject-chart">
            <Bar data={chartData} options={options} />
          </div>

        ) : (

          <p>No subject attendance data available.</p>

        )}

      </div>

    </div>

  );

}

export default SubjectAnalytics;