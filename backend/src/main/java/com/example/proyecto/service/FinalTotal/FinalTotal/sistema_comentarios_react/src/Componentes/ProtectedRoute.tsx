import { ReactNode } from "react";
import {Navigate, useNavigate,} from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({children}: ProtectedRouteProps) {

    const navigate = useNavigate();

    function salir(){
        localStorage.removeItem("token");
        navigate("/");
    }

    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return (
        <>
            <br/>
            <button onClick={salir} className={"btn btn-primary"}>Salir</button>
            <hr/>
            {children}
        </>
    );
}

export default ProtectedRoute;