import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function NavEmpresa() {
    const navigate = useNavigate();
    const usuario = localStorage.getItem('correo') || 'Empresa';

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
                    <NavLink to="/empresa" className="logo-link">
                        <span className="logo-text">Panel Empresa</span>
                    </NavLink>

                    <ul className="nav-menu">
                        <li>
                            <NavLink to="/empresa" end>
                                Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/empresa/puestos">
                                Mis puestos
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/empresa/puestos/nuevo">
                                Publicar puesto
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/empresa/candidatos">
                                Buscar candidatos
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

export default NavEmpresa;