import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { cerrarSesion, obtenerCorreo } from '../../utils/authStorage';
import { RUTA_LOGIN } from '../../utils/constants';

function NavAdmin() {
    const navigate = useNavigate();
    const usuario = obtenerCorreo() || 'Administrador';

    function manejarCerrarSesion() {
        cerrarSesion();
        navigate(RUTA_LOGIN, { replace: true });
    }

    return (
        <header className="main-header">
            <nav className="nav-container">
                <div className="nav-left">
                    <NavLink to="/admin" className="logo-link">
                        <span className="logo-text">Panel Administrador</span>
                    </NavLink>

                    <ul className="nav-menu">
                        <li>
                            <NavLink to="/admin" end>
                                Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/empresas-pendientes">
                                Empresas pendientes
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/oferentes-pendientes">
                                Oferentes pendientes
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/caracteristicas">
                                Características
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/admin/reportes">
                                Reportes
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="nav-right">
                    <div className="nav-user-box">
                        <span className="nav-user-email">{usuario}</span>

                        <button
                            type="button"
                            className="btn btn-outline-light btn-sm"
                            onClick={manejarCerrarSesion}
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavAdmin;