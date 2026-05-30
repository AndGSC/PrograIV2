import React from 'react';
import { Outlet } from 'react-router-dom';
import NavAdmin from '../componentes/navegacion/NavAdmin';
import Footer from '../componentes/comunes/Footer';

function AdminLayout() {
    return (
        <div className="app-shell">
            <NavAdmin />

            <main className="page-container">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}

export default AdminLayout;