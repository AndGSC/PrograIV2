import React from 'react';
import { NavLink } from 'react-router-dom';

function NavPublica() {
    return (
        <header className="main-header">
            <nav className="nav-container">
                <div className="nav-left">
                    <NavLink to="/" className="logo-link">
                        <span className="logo-text">Bolsa de Empleo</span>
                    </NavLink>

                    <ul className="nav-menu">
                        <li>
                            <NavLink to="/" end>
                                Inicio
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/puestos-publicos">
                                Puestos públicos
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/puestos">
                                Buscar puestos
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/registro-empresa">
                                Registro empresa
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to="/registro-oferente">
                                Registro oferente
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="nav-right">
                    <NavLink to="/login" className="nav-login-link">
                        Iniciar sesión
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}

export default NavPublica;