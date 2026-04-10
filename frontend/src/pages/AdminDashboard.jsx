import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";
import { BASE_URL } from "../config.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AdminDashboard() {

  const navigate = useNavigate();

  const [totalStudents,setTotalStudents] = useState(0);
  const [present,setPresent] = useState(0);
  const [absent,setAbsent] = useState(0);
  const [average,setAverage] = useState(0);
  const [totalAttendance,setTotalAttendance] = useState(0);
  const [monthlyData,setMonthlyData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [lastUpdated,setLastUpdated] = useState("");

  const API = `${BASE_URL}/api`;
  const token = localStorage.getItem("token");

  /* 🔥 3D TILT FUNCTIONS */

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 12;
    const rotateY = (x - centerX) / 12;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = (e) => {
    e.currentTarget.style.transform = "rotateX(0) rotateY(0)";
  };

  useEffect(()=>{

    if(!token){
      navigate("/");
      return;
    }

    fetchDashboard();

  },[]);

  const fetchDashboard = async()=>{

    try{

      setLoading(true);

      const headers={
        Authorization:`Bearer ${token}`
      };

      const [studentsRes,attendanceRes] = await Promise.all([
        axios.get(`${API}/students`,{headers}),
        axios.get(`${API}/attendance`,{headers})
      ]);

      const students = Array.isArray(studentsRes.data)
      ? studentsRes.data
      : studentsRes.data.students || [];

      const attendance = Array.isArray(attendanceRes.data)
      ? attendanceRes.data
      : attendanceRes.data.records || [];

      setTotalStudents(students.length);
      setTotalAttendance(attendance.length);

      const today = new Date().toISOString().split("T")[0];

      const todayRecords = attendance.filter(a =>
        a.date && a.date.startsWith(today)
      );

      const presentCount = todayRecords.filter(
        a => a.status === "Present"
      ).length;

      const absentCount = todayRecords.filter(
        a => a.status === "Absent"
      ).length;

      setPresent(presentCount);
      setAbsent(absentCount);

      const totalPresent = attendance.filter(
        a => a.status === "Present"
      ).length;

      const avg = attendance.length === 0
      ? 0
      : ((totalPresent / attendance.length) * 100).toFixed(1);

      setAverage(avg);

      const monthly={};

      attendance.forEach(record=>{
        if(!record.date) return;

        const month = record.date.slice(0,7);

        if(!monthly[month]){
          monthly[month]={present:0,absent:0};
        }

        if(record.status==="Present"){
          monthly[month].present++;
        }else{
          monthly[month].absent++;
        }
      });

      const labels = Object.keys(monthly).sort();

      if(labels.length>0){
        setMonthlyData({
          labels,
          datasets:[
            {
              label:"Present",
              data:labels.map(m=>monthly[m].present),
              backgroundColor:"#4caf50"
            },
            {
              label:"Absent",
              data:labels.map(m=>monthly[m].absent),
              backgroundColor:"#ff4d4d"
            }
          ]
        });
      }else{
        setMonthlyData(null);
      }

      setLastUpdated(new Date().toLocaleTimeString());

    }catch(error){

      if(error.response?.status===401){
        alert("Session expired");
        localStorage.clear();
        navigate("/");
      }else{
        alert("Error loading dashboard");
      }

    }finally{
      setLoading(false);
    }

  };

  const logout = ()=>{
    localStorage.clear();
    navigate("/");
  };

  const pieData={
    labels:["Present","Absent"],
    datasets:[
      {
        data:[present,absent],
        backgroundColor:["#4caf50","#ff4d4d"]
      }
    ]
  };

  const chartOptions={
    responsive:true,
    plugins:{
      legend:{position:"top"}
    }
  };

  return(

    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <div className="sidebar">

        <h2>Attendance</h2>

        <ul>
          <li onClick={()=>navigate("/admin-dashboard")}>Dashboard</li>
          <li onClick={()=>navigate("/students")}>Students</li>
          <li onClick={()=>navigate("/attendance")}>Mark Attendance</li>
          <li onClick={()=>navigate("/generate-qr")}>QR Attendance</li>
          <li onClick={()=>navigate("/reports")}>Reports</li>
          <li onClick={()=>navigate("/today-attendance")}>Today's Attendance</li>
          <li onClick={()=>navigate("/low-attendance")}>Low Attendance</li>
          <li onClick={()=>navigate("/subject-analytics")}>Subject Analytics</li>
          <li onClick={()=>navigate("/top-attendance")}>Top Attendance</li>
          <li onClick={()=>navigate("/attendance-predictor")}>Attendance Predictor</li>
          <li onClick={()=>navigate("/department-analytics")}>Department Analytics</li>
          <li onClick={()=>navigate("/class-scheduler")}>Class Scheduler</li>
          <li onClick={()=>navigate("/system-overview")}>System Overview</li>
          <li onClick={logout}>Logout</li>
        </ul>

      </div>

      {/* CONTENT */}
      <div className="dashboard-content">

        <div className="dashboard-header">

          <h1>Admin Dashboard</h1>

          <div>
            <button onClick={fetchDashboard}>Refresh</button>
            <span style={{marginLeft:"15px",fontSize:"12px"}}>
              Last Updated: {lastUpdated}
            </span>
          </div>

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="dashboard-cards">

              {/* 🔥 CARDS WITH 3D */}
              {[ 
                {title:"Total Students", value:totalStudents},
                {title:"Total Attendance", value:totalAttendance},
                {title:"Present Today", value:present},
                {title:"Absent Today", value:absent},
                {title:"Average", value:`${average}%`}
              ].map((item, i)=>(
                <div
                  key={i}
                  className="card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={resetTilt}
                >
                  <h3>{item.title}</h3>
                  <p>{item.value}</p>
                </div>
              ))}

            </div>

            {(present+absent)>0 &&(
              <>
                <h2 style={{marginTop:"40px"}}>Today Attendance</h2>
                <div className="chart-box">
                  <Pie data={pieData} options={chartOptions}/>
                </div>
              </>
            )}

            {monthlyData &&(
              <>
                <h2 style={{marginTop:"40px"}}>Monthly Analytics</h2>
                <div style={{width:"650px"}}>
                  <Bar data={monthlyData} options={chartOptions}/>
                </div>
              </>
            )}
          </>
        )}

      </div>

    </div>

  );
}

export default AdminDashboard;