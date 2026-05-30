import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function NavAdmin() {
    const navigate = useNavigate();
    const usuario = localStorage.getItem('correo') || 'Administrador';

    function cerrarSesion() {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('correo');

        navigate('/login');
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
                            onClick={cerrarSesion}
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