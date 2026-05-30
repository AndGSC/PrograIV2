import React from 'react';
import { Outlet } from 'react-router-dom';
import NavEmpresa from '../componentes/navegacion/NavEmpresa';
import Footer from '../componentes/comunes/Footer';

function EmpresaLayout() {
    return (
        <div className="app-shell">
            <NavEmpresa />

            <main className="page-container">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default EmpresaLayout;