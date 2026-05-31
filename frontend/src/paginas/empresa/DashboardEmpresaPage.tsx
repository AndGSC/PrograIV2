import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';
import EmptyState from '../../componentes/comunes/EmptyState';

import {
    obtenerMisPuestos,
    buscarCandidatos
} from '../../api/empresaApi';

import { ApiError } from '../../api/http';

import type { PuestoEmpresa } from '../../tipos/puesto';
import type { Candidato } from '../../tipos/candidato';

function estaActivo(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    return estadoNormalizado === 'ACTIVO';
}

function obtenerTextoEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (estadoNormalizado === 'ACTIVO') {
        return 'Activo';
    }

    if (estadoNormalizado === 'INACTIVO') {
        return 'Inactivo';
    }

    return estado;
}

function obtenerClaseEstado(estado: string) {
    if (estaActivo(estado)) {
        return 'badge badge-success';
    }

    return 'badge badge-neutral';
}

function DashboardEmpresaPage() {
    const [puestos, setPuestos] = useState<PuestoEmpresa[]>([]);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarDashboard() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const [datosPuestos, datosCandidatos] = await Promise.all([
                    obtenerMisPuestos(),
                    buscarCandidatos({})
                ]);

                setPuestos(datosPuestos || []);
                setCandidatos(datosCandidatos || []);
            } catch (error) {
                setPuestos([]);
                setCandidatos([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudo cargar la información del dashboard de empresa.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarDashboard();
    }, []);

    const puestosActivos = puestos.filter((puesto) => estaActivo(puesto.estado)).length;
    const puestosInactivos = puestos.length - puestosActivos;
    const ultimosPuestos = puestos.slice(0, 3);

    return (
        <>
            <PageHeader
                titulo="Dashboard empresa"
                subtitulo="Panel principal para gestionar puestos publicados y búsqueda de candidatos"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando información de la empresa..." />
            ) : (
                <>
                    <section className="dashboard-grid">
                        <div className="stat-card">
                            <h3>Puestos publicados</h3>
                            <p>{puestos.length}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Puestos activos</h3>
                            <p>{puestosActivos}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Candidatos encontrados</h3>
                            <p>{candidatos.length}</p>
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

                                <div className="detail-list mt-2">
                                    <div className="detail-item">
                                        <span className="detail-label">Activos:</span>
                                        <span className="detail-value">{puestosActivos}</span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Inactivos:</span>
                                        <span className="detail-value">{puestosInactivos}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-card">
                                <h3 className="card-title">Búsqueda de candidatos</h3>
                                <p className="card-text">
                                    Busque oferentes cuyas habilidades coincidan con las características
                                    requeridas para los puestos publicados.
                                </p>

                                <div className="detail-list mt-2">
                                    <div className="detail-item">
                                        <span className="detail-label">Candidatos disponibles:</span>
                                        <span className="detail-value">{candidatos.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section-block">
                        <div className="content-card">
                            <div className="search-results-header">
                                <h2 className="section-title mb-0">Últimos puestos registrados</h2>

                                <Link to="/empresa/puestos" className="btn btn-primary btn-sm">
                                    Ver todos
                                </Link>
                            </div>

                            {ultimosPuestos.length === 0 ? (
                                <EmptyState mensaje="No hay puestos registrados por la empresa." />
                            ) : (
                                <div className="table-wrapper">
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>Título</th>
                                            <th>Salario</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {ultimosPuestos.map((puesto) => (
                                            <tr key={puesto.id}>
                                                <td>{puesto.titulo}</td>
                                                <td>{puesto.salario}</td>
                                                <td>
                                                        <span className={obtenerClaseEstado(puesto.estado)}>
                                                            {obtenerTextoEstado(puesto.estado)}
                                                        </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/empresa/candidatos?puestoId=${puesto.id}`}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        Buscar candidatos
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </>
    );
}

export default DashboardEmpresaPage;