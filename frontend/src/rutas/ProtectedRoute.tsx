import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { estaAutenticado } from '../utils/authStorage';
import { RUTA_LOGIN } from '../utils/constants';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();

    if (!estaAutenticado()) {
        return (
            <Navigate
                to={RUTA_LOGIN}
                replace
                state={{ from: `${location.pathname}${location.search}` }}
            />
        );
    }

    return <>{children}</>;
}

export default ProtectedRoute;