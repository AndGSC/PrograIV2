import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';

function DashboardEmpresaPage() {
    return (
        <>
            <PageHeader
                titulo="Dashboard empresa"
                subtitulo="Panel principal para gestionar puestos publicados y búsqueda de candidatos"
            />

            <section className="dashboard-grid">
                <div className="stat-card">
                    <h3>Puestos publicados</h3>
                    <p>4</p>
                </div>

                <div className="stat-card">
                    <h3>Puestos activos</h3>
                    <p>3</p>
                </div>

                <div className="stat-card">
                    <h3>Candidatos encontrados</h3>
                    <p>9</p>
                </div>
            </section>

            <section className="section-block mt-3">
                <div className="content-card">
                    <h2 className="section-title">Acciones rápidas</h2>

                    <div className="quick-links">
                        <Link to="/empresa/puestos/nuevo" className="btn btn-primary">
                            Publicar puesto
                        </Link>

                        <Link to="/empresa/puestos" className="btn btn-secondary">
                            Ver mis puestos
                        </Link>

                        <Link to="/empresa/candidatos" className="btn btn-outline-dark">
                            Buscar candidatos
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section-block">
                <div className="grid-2-equal">
                    <div className="info-card">
                        <h3 className="card-title">Gestión de puestos</h3>
                        <p className="card-text">
                            Publique nuevos puestos, revise los puestos existentes y desactive aquellos
                            que ya no se encuentren disponibles.
                        </p>
                    </div>

                    <div className="info-card">
                        <h3 className="card-title">Búsqueda de candidatos</h3>
                        <p className="card-text">
                            Busque oferentes cuyas habilidades coincidan con las características
                            requeridas para los puestos publicados.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashboardEmpresaPage;