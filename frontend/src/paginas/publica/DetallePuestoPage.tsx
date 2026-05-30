import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';
import EmptyState from '../../componentes/comunes/EmptyState';

import { obtenerDetallePuesto } from '../../api/publicApi';
import { ApiError } from '../../api/http';

import type { PuestoPublico } from '../../tipos/puesto';

function DetallePuestoPage() {
    const { id } = useParams();

    const [puesto, setPuesto] = useState<PuestoPublico | null>(null);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarDetallePuesto() {
            if (!id) {
                setPuesto(null);
                setTipoMensaje('danger');
                setMensaje('No se indicó el puesto que desea consultar.');
                setCargando(false);
                return;
            }

            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerDetallePuesto(id);
                setPuesto(datos);
            } catch (error) {
                setPuesto(null);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudo cargar el detalle del puesto.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarDetallePuesto();
    }, [id]);

    return (
        <>
            <PageHeader
                titulo="Detalle del puesto"
                subtitulo="Información general y características requeridas"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando detalle del puesto..." />
            ) : !puesto ? (
                <EmptyState mensaje="No se encontró información del puesto solicitado." />
            ) : (
                <section className="content-layout">
                    <div className="detail-card">
                        <h2 className="section-title">{puesto.puesto}</h2>

                        <div className="detail-list">
                            <div className="detail-item">
                                <span className="detail-label">Empresa:</span>
                                <span className="detail-value">{puesto.empresa}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Salario ofrecido:</span>
                                <span className="detail-value">{puesto.salario}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Tipo de publicación:</span>
                                <span className="badge badge-info">{puesto.tipo}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Descripción:</span>
                                <p className="detail-value mt-1">
                                    {puesto.descripcion || 'Sin descripción registrada.'}
                                </p>
                            </div>
                        </div>

                        <div className="actions-row mt-3">
                            <Link to="/puestos" className="btn btn-secondary">
                                Volver a búsqueda
                            </Link>

                            <Link to="/puestos-publicos" className="btn btn-outline-dark">
                                Ver puestos públicos
                            </Link>
                        </div>
                    </div>

                    <aside className="info-card">
                        <h3 className="card-title">Características requeridas</h3>

                        {puesto.caracteristicas && puesto.caracteristicas.length > 0 ? (
                            <ul className="simple-list">
                                {puesto.caracteristicas.map((caracteristica, index) => (
                                    <li key={index}>{caracteristica}</li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState mensaje="Este puesto no tiene características registradas." />
                        )}
                    </aside>
                </section>
            )}
        </>
    );
}

export default DetallePuestoPage;