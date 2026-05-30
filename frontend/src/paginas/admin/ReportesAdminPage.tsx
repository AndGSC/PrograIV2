import React from 'react';
import PageHeader from '../../componentes/comunes/PageHeader';

function ReportesAdminPage() {
    return (
        <>
            <PageHeader
                titulo="Reportes"
                subtitulo="Resumen general de información registrada en el sistema"
            />

            <section className="dashboard-grid">
                <div className="stat-card">
                    <h3>Empresas aprobadas</h3>
                    <p>8</p>
                </div>

                <div className="stat-card">
                    <h3>Oferentes aprobados</h3>
                    <p>14</p>
                </div>

                <div className="stat-card">
                    <h3>Puestos públicos</h3>
                    <p>10</p>
                </div>
            </section>

            <section className="section-block mt-3">
                <div className="grid-2-equal">
                    <div className="content-card">
                        <h2 className="section-title">Registros pendientes</h2>

                        <div className="detail-list">
                            <div className="detail-item">
                                <span className="detail-label">Empresas pendientes:</span>
                                <span className="detail-value">3</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Oferentes pendientes:</span>
                                <span className="detail-value">5</span>
                            </div>
                        </div>
                    </div>

                    <div className="content-card">
                        <h2 className="section-title">Características</h2>

                        <div className="detail-list">
                            <div className="detail-item">
                                <span className="detail-label">Activas:</span>
                                <span className="detail-value">12</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Inactivas:</span>
                                <span className="detail-value">2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ReportesAdminPage;