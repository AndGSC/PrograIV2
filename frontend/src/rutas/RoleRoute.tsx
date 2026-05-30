import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleRouteProps {
    children: React.ReactNode;
    rolesPermitidos: string[];
}

function RoleRoute({ children, rolesPermitidos }: RoleRouteProps) {
    const location = useLocation();

    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (!rol || !rolesPermitidos.includes(rol)) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return <>{children}</>;
}

export default RoleRoute;