import React, { useEffect, useState } from 'react';

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

function ReportesAdminPage() {
    const [reporte, setReporte] = useState<ReporteAdmin>(reporteInicial);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarReportes() {
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
                    setMensaje('No se pudo cargar la información de reportes.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarReportes();
    }, []);

    return (
        <>
            <PageHeader
                titulo="Reportes"
                subtitulo="Resumen general de información registrada en el sistema"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando reportes del sistema..." />
            ) : (
                <>
                    <section className="dashboard-grid">
                        <div className="stat-card">
                            <h3>Empresas aprobadas</h3>
                            <p>{reporte.empresasAprobadas}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Oferentes aprobados</h3>
                            <p>{reporte.oferentesAprobados}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Puestos públicos</h3>
                            <p>{reporte.puestosPublicos}</p>
                        </div>
                    </section>

                    <section className="section-block mt-3">
                        <div className="grid-2-equal">
                            <div className="content-card">
                                <h2 className="section-title">Registros pendientes</h2>

                                <div className="detail-list">
                                    <div className="detail-item">
                                        <span className="detail-label">Empresas pendientes:</span>
                                        <span className="detail-value">
                                            {reporte.empresasPendientes}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Oferentes pendientes:</span>
                                        <span className="detail-value">
                                            {reporte.oferentesPendientes}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="content-card">
                                <h2 className="section-title">Características</h2>

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
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
}

export default ReportesAdminPage;