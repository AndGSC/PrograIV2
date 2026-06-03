import { useNavigate } from "react-router-dom";
import {useState} from "react";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    async function handleLogin() {
        const response = await fetch("http://localhost:8080/auth/login",
            {
                method: "POST",
                headers: new Headers({"Content-Type": "application/json"}),
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            navigate("/");
        }
        else{
            alert("Error en login")
        }
    }


    return (
        <div>
            <h1>Login</h1>
            <input onChange={e=> setUsername(e.target.value)} value={username} type="text" placeholder="Usuario" />
            <input onChange={e=> setPassword(e.target.value)}  value={password} type="password" placeholder="Contraseña" />
            <button onClick={handleLogin}>Ingresar</button>
        </div>
    );
}

export default Login;