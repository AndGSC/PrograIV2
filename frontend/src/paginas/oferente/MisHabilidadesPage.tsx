import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';

function DashboardOferentePage() {
    return (
        <>
            <PageHeader
                titulo="Dashboard oferente"
                subtitulo="Panel principal para gestionar habilidades y currículo"
            />

            <section className="dashboard-grid">
                <div className="stat-card">
                    <h3>Habilidades registradas</h3>
                    <p>5</p>
                </div>

                <div className="stat-card">
                    <h3>Currículo</h3>
                    <p>1</p>
                </div>

                <div className="stat-card">
                    <h3>Estado del perfil</h3>
                    <p>Activo</p>
                </div>
            </section>

            <section className="section-block mt-3">
                <div className="content-card">
                    <h2 className="section-title">Acciones rápidas</h2>

                    <div className="quick-links">
                        <Link to="/oferente/habilidades" className="btn btn-primary">
                            Gestionar habilidades
                        </Link>

                        <Link to="/oferente/cv" className="btn btn-secondary">
                            Subir currículo
                        </Link>

                        <Link to="/puestos" className="btn btn-outline-dark">
                            Buscar puestos públicos
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section-block">
                <div className="grid-2-equal">
                    <div className="info-card">
                        <h3 className="card-title">Habilidades</h3>
                        <p className="card-text">
                            Registre sus características, destrezas y niveles de dominio para que las empresas
                            puedan encontrar su perfil.
                        </p>
                    </div>

                    <div className="info-card">
                        <h3 className="card-title">Currículo PDF</h3>
                        <p className="card-text">
                            Mantenga actualizado su currículo en formato PDF para que las empresas puedan
                            consultarlo al revisar su perfil.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default DashboardOferentePage;