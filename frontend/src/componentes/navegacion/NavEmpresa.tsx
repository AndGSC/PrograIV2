import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { cerrarSesion, obtenerCorreo } from '../../utils/authStorage';
import { RUTA_LOGIN } from '../../utils/constants';

function NavEmpresa() {
    const navigate = useNavigate();
    const usuario = obtenerCorreo() || 'Empresa';

    function manejarCerrarSesion() {
        cerrarSesion();
        navigate(RUTA_LOGIN, { replace: true });
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

export default NavEmpresa;