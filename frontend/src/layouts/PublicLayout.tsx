import React from 'react';
import { Outlet } from 'react-router-dom';
import NavPublica from '../componentes/navegacion/NavPublica';
import Footer from '../componentes/comunes/Footer';

function PublicLayout() {
    return (
        <div className="app-shell">
            <NavPublica />

            <main className="page-container">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default PublicLayout;