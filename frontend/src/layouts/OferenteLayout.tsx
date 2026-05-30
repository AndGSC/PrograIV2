import React from 'react';
import { Outlet } from 'react-router-dom';
import NavOferente from '../componentes/navegacion/NavOferente';
import Footer from '../componentes/comunes/Footer';

function OferenteLayout() {
    return (
        <div className="app-shell">
            <NavOferente />

            <main className="page-container">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default OferenteLayout;