import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { estaAutenticado, tieneRol } from '../utils/authStorage';
import { RUTA_HOME, RUTA_LOGIN } from '../utils/constants';

interface RoleRouteProps {
    children: React.ReactNode;
    rolesPermitidos: string[];
}

function RoleRoute({ children, rolesPermitidos }: RoleRouteProps) {
    const location = useLocation();

    if (!estaAutenticado()) {
        return (
            <Navigate
                to={RUTA_LOGIN}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    if (!tieneRol(rolesPermitidos)) {
        return (
            <Navigate
                to={RUTA_HOME}
                replace
            />
        );
    }

    return <>{children}</>;
}

export default RoleRoute;