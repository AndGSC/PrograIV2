import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import { obtenerReportesAdmin } from '../../api/adminApi';
import { ApiError } from '../../api/http';

import type { ReporteAdmin } from '../../tipos/api';

const reporteInicial: ReporteAdmin = {
    empresasAprobadas: 0,
    oferentesAprobados: 0,
    puestosPublicos: 0,
    empresasPendientes: 0,
    oferentesPendientes: 0,
    caracteristicasActivas: 0,
    caracteristicasInactivas: 0
};

function DashboardAdminPage() {
    const [reporte, setReporte] = useState<ReporteAdmin>(reporteInicial);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarDashboard() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerReportesAdmin();
                setReporte(datos || reporteInicial);
            } catch (error) {
                setReporte(reporteInicial);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudo cargar la información del dashboard.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarDashboard();
    }, []);

    const totalCaracteristicas =
        reporte.caracteristicasActivas + reporte.caracteristicasInactivas;

    return (
        <>
            <PageHeader
                titulo="Dashboard administrador"
                subtitulo="Panel principal para gestionar empresas, oferentes y características del sistema"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando información del administrador..." />
            ) : (
                <>
                    <section className="dashboard-grid">
                        <div className="stat-card">
                            <h3>Empresas pendientes</h3>
                            <p>{reporte.empresasPendientes}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Oferentes pendientes</h3>
                            <p>{reporte.oferentesPendientes}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Características registradas</h3>
                            <p>{totalCaracteristicas}</p>
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

                    <section className="section-block">
                        <div className="grid-2-equal">
                            <div className="content-card">
                                <h2 className="section-title">Resumen de usuarios</h2>

                                <div className="detail-list">
                                    <div className="detail-item">
                                        <span className="detail-label">Empresas aprobadas:</span>
                                        <span className="detail-value">
                                            {reporte.empresasAprobadas}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Oferentes aprobados:</span>
                                        <span className="detail-value">
                                            {reporte.oferentesAprobados}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Puestos públicos:</span>
                                        <span className="detail-value">
                                            {reporte.puestosPublicos}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="content-card">
                                <h2 className="section-title">Resumen de características</h2>

                                <div className="detail-list">
                                    <div className="detail-item">
                                        <span className="detail-label">Activas:</span>
                                        <span className="detail-value">
                                            {reporte.caracteristicasActivas}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Inactivas:</span>
                                        <span className="detail-value">
                                            {reporte.caracteristicasInactivas}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Total:</span>
                                        <span className="detail-value">
                                            {totalCaracteristicas}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
}

export default DashboardAdminPage;