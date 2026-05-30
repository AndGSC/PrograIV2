import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';

function DashboardAdminPage() {
    return (
        <>
            <PageHeader
                titulo="Dashboard administrador"
                subtitulo="Panel principal para gestionar empresas, oferentes y características del sistema"
            />

            <section className="dashboard-grid">
                <div className="stat-card">
                    <h3>Empresas pendientes</h3>
                    <p>3</p>
                </div>

                <div className="stat-card">
                    <h3>Oferentes pendientes</h3>
                    <p>5</p>
                </div>

                <div className="stat-card">
                    <h3>Características registradas</h3>
                    <p>12</p>
                </div>
            </section>

            <section className="section-block mt-3">
                <div className="content-card">
                    <h2 className="section-title">Acciones rápidas</h2>

                    <div className="quick-links">
                        <Link to="/admin/empresas-pendientes" className="btn btn-primary">
                            Revisar empresas
                        </Link>

                        <Link to="/admin/oferentes-pendientes" className="btn btn-primary">
                            Revisar oferentes
                        </Link>

                        <Link to="/admin/caracteristicas" className="btn btn-secondary">
                            Administrar características
                        </Link>

                        <Link to="/admin/reportes" className="btn btn-outline-dark">
                            Ver reportes
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashboardAdminPage;