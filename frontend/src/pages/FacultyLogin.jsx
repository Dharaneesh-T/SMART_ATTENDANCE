import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";

function FacultyLogin(){

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");

const navigate = useNavigate();

const login = async (e) => {

e.preventDefault();

try{

const res = await axios.post(
`${BASE_URL}/api/faculty/login`,
{ username,password }
);

localStorage.setItem("facultyToken",res.data.token);

navigate("/faculty-dashboard");

}catch(error){

alert("Invalid login");

}

};

return(

<div className="login-container">

<form className="login-form" onSubmit={login}>

<h2>Faculty Login</h2>

<input
placeholder="Username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button type="submit">
Login
</button>

</form>

</div>

);

}

export default FacultyLogin;