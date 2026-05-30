import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';
import MessageBox from '../../componentes/comunes/MessageBox';

import { obtenerPuestosPublicos } from '../../api/publicApi';
import { ApiError } from '../../api/http';

import type { PuestoPublico } from '../../tipos/puesto';

function PuestosPublicosPage() {
    const [puestosPublicos, setPuestosPublicos] = useState<PuestoPublico[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarPuestosPublicos() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerPuestosPublicos();
                setPuestosPublicos(datos || []);
            } catch (error) {
                setPuestosPublicos([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudieron cargar los puestos públicos.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarPuestosPublicos();
    }, []);

    return (
        <>
            <PageHeader
                titulo="Puestos públicos"
                subtitulo="Últimos puestos públicos registrados por empresas"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando puestos públicos..." />
            ) : (
                <section className="public-jobs-section">
                    {puestosPublicos.length === 0 ? (
                        <EmptyState mensaje="No hay puestos públicos registrados." />
                    ) : (
                        <div className="jobs-grid">
                            {puestosPublicos.map((puesto) => (
                                <article className="job-card" key={puesto.id}>
                                    <div className="job-card-body">
                                        <h3 className="job-company">{puesto.empresa}</h3>

                                        <p className="job-position">{puesto.puesto}</p>

                                        <p className="job-salary">{puesto.salario}</p>

                                        <span className="badge badge-info job-type">
                                            {puesto.tipo}
                                        </span>

                                        <Link
                                            to={`/puestos/${puesto.id}`}
                                            className="job-detail-btn"
                                        >
                                            Ver detalle
                                        </Link>
                                    </div>

                                    <div className="job-hover-detail">
                                        <h4 className="job-hover-title">
                                            Características requeridas
                                        </h4>

                                        <p>
                                            {puesto.descripcion || 'Sin descripción registrada.'}
                                        </p>

                                        {puesto.caracteristicas && puesto.caracteristicas.length > 0 ? (
                                            <ul className="job-feature-list">
                                                {puesto.caracteristicas.map((caracteristica, index) => (
                                                    <li key={index}>{caracteristica}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No hay características registradas.</p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </>
    );
}

export default PuestosPublicosPage;