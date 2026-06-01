import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';
import EmptyState from '../../componentes/comunes/EmptyState';

import {
    obtenerDetalleCandidato,
    obtenerUrlCurriculoCandidato
} from '../../api/empresaApi';
import { ApiError } from '../../api/http';
import { obtenerToken } from '../../utils/authStorage';

import type { Candidato } from '../../tipos/candidato';

function DetalleCandidatoPage() {
    const { id } = useParams();

    const [candidato, setCandidato] = useState<Candidato | null>(null);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cargandoPreview, setCargandoPreview] = useState(false);
    const [mensajePreview, setMensajePreview] = useState('');

    useEffect(() => {
        async function cargarDetalleCandidato() {
            if (!id) {
                setCandidato(null);
                setTipoMensaje('danger');
                setMensaje('No se indicó el candidato que desea consultar.');
                setCargando(false);
                return;
            }

            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerDetalleCandidato(id);
                setCandidato(datos);
            } catch (error) {
                setCandidato(null);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudo cargar el detalle del candidato.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarDetalleCandidato();
    }, [id]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    useEffect(() => {
        if (!id || !candidato?.cvDisponible) {
            setPreviewUrl(null);
            setMensajePreview('');
            return;
        }

        cargarPreviewCv();
    }, [id, candidato?.cvDisponible]);

    async function cargarPreviewCv() {
        if (!id || !candidato?.cvDisponible) {
            return null;
        }

        const token = obtenerToken();
        if (!token) {
            setMensajePreview('No hay sesión activa para cargar el currículo.');
            setPreviewUrl(null);
            return null;
        }

        const urlCurriculo = obtenerUrlCurriculoCandidato(id);

        setCargandoPreview(true);
        setMensajePreview('');

        try {
            const response = await fetch(urlCurriculo, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                setMensajePreview('No se pudo cargar el currículo para previsualizar.');
                setPreviewUrl(null);
                return null;
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            setPreviewUrl((anterior) => {
                if (anterior) {
                    URL.revokeObjectURL(anterior);
                }
                return objectUrl;
            });

            return objectUrl;
        } catch {
            setMensajePreview('No se pudo cargar el currículo para previsualizar.');
            setPreviewUrl(null);
            return null;
        } finally {
            setCargandoPreview(false);
        }
    }

    async function verCurriculo() {
        if (!id || !candidato?.cvDisponible) {
            return;
        }

        const urlPdf = previewUrl || await cargarPreviewCv();

        if (!urlPdf) {
            return;
        }

        window.open(
            urlPdf,
            '_blank',
            'noopener,noreferrer'
        );
    }

    return (
        <>
            <PageHeader
                titulo="Detalle del candidato"
                subtitulo="Información del oferente y habilidades registradas"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando detalle del candidato..." />
            ) : !candidato ? (
                <EmptyState mensaje="No se encontró información del candidato solicitado." />
            ) : (
                <section className="content-layout">
                    <div className="detail-card">
                        <h2 className="section-title">{candidato.nombre}</h2>

                        <div className="detail-list">
                            <div className="detail-item">
                                <span className="detail-label">Identificación:</span>
                                <span className="detail-value">
                                    {candidato.identificacion || 'No registrada'}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Nacionalidad:</span>
                                <span className="detail-value">
                                    {candidato.nacionalidad || 'No registrada'}
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Teléfono:</span>
                                <span className="detail-value">{candidato.telefono}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Correo:</span>
                                <span className="detail-value">{candidato.correo}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Residencia:</span>
                                <span className="detail-value">{candidato.residencia}</span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Coincidencia:</span>
                                <span className="badge badge-success">
                                    {candidato.coincidencia}%
                                </span>
                            </div>

                            <div className="detail-item">
                                <span className="detail-label">Currículo:</span>
                                <span
                                    className={
                                        candidato.cvDisponible
                                            ? 'badge badge-success'
                                            : 'badge badge-neutral'
                                    }
                                >
                                    {candidato.cvDisponible ? 'Disponible' : 'No disponible'}
                                </span>
                            </div>
                        </div>

                        <div className="actions-row mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={verCurriculo}
                                disabled={!candidato.cvDisponible}
                            >
                                Ver currículo en nueva pestaña
                            </button>

                            <Link to="/empresa/candidatos" className="btn btn-secondary">
                                Volver a candidatos
                            </Link>
                        </div>

                        {candidato.cvDisponible && (
                            <div className="cv-preview mt-3">
                                <h3 className="section-title">Previsualización</h3>

                                {mensajePreview && (
                                    <MessageBox tipo="warning" mensaje={mensajePreview} />
                                )}

                                {cargandoPreview ? (
                                    <Loading mensaje="Cargando previsualización..." />
                                ) : previewUrl ? (
                                    <iframe
                                        title="Previsualización del currículo"
                                        className="cv-preview-frame"
                                        src={previewUrl}
                                    />
                                ) : (
                                    <p className="cv-status">No se pudo cargar la previsualización.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <aside className="info-card">
                        <h3 className="card-title">Habilidades registradas</h3>

                        {candidato.habilidades && candidato.habilidades.length > 0 ? (
                            <ul className="simple-list">
                                {candidato.habilidades.map((habilidad, index) => (
                                    <li key={index}>{habilidad}</li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyState mensaje="Este candidato no tiene habilidades registradas." />
                        )}
                    </aside>
                </section>
            )}
        </>
    );
}

export default DetalleCandidatoPage;