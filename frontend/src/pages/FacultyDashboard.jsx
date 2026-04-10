import { useNavigate } from "react-router-dom";

function FacultyDashboard(){

const navigate = useNavigate();

return(

<div className="dashboard-content">

<h1>Faculty Dashboard</h1>

<div className="dashboard-cards">

<div
className="card"
onClick={()=>navigate("/faculty-attendance")}
>

<h3>Mark Attendance</h3>
<p>Mark attendance for your subject</p>

</div>

<div
className="card"
onClick={()=>navigate("/reports")}
>

<h3>View Reports</h3>
<p>Check attendance reports</p>

</div>

</div>

</div>

);

}

export default FacultyDashboard;