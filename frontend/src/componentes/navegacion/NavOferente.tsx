import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { cerrarSesion, obtenerCorreo } from '../../utils/authStorage';
import { RUTA_LOGIN } from '../../utils/constants';

function NavOferente() {
    const navigate = useNavigate();
    const usuario = obtenerCorreo() || 'Oferente';

    function manejarCerrarSesion() {
        cerrarSesion();
        navigate(RUTA_LOGIN);
    }

    return (
        <header className="main-header">
            <nav className="nav-container">
                <div className="nav-left">
                    <NavLink to="/oferente" className="logo-link">
                        <span className="logo-text">Panel Oferente</span>
                    </NavLink>

                    <ul className="nav-menu">
                        <li>
                            <NavLink to="/oferente" end>
                                Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/oferente/habilidades">
                                Mis habilidades
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/oferente/cv">
                                Mi CV
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

export default NavOferente;