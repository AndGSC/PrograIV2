import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function NavOferente() {
    const navigate = useNavigate();
    const usuario = localStorage.getItem('correo') || 'Oferente';

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

export default NavOferente;