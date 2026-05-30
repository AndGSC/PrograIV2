import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';

function DetalleCandidatoPage() {
    const { id } = useParams();

    const candidato = {
        id,
        identificacion: '1-1111-1111',
        nombre: 'Carlos Mora',
        nacionalidad: 'Costarricense',
        telefono: '8888-1111',
        correo: 'carlos@correo.com',
        residencia: 'Alajuela',
        coincidencia: 85,
        cvDisponible: true,
        habilidades: [
            'Java - Intermedio',
            'Spring - Básico',
            'MySQL - Básico',
            'HTML - Intermedio',
            'CSS - Intermedio'
        ]
    };

    function verCurriculo() {
        alert('La visualización del currículo se conectará luego con el backend.');
    }

    return (
        <>
            <PageHeader
                titulo="Detalle del candidato"
                subtitulo="Información del oferente y habilidades registradas"
            />

            <section className="content-layout">
                <div className="detail-card">
                    <h2 className="section-title">{candidato.nombre}</h2>

                    <div className="detail-list">
                        <div className="detail-item">
                            <span className="detail-label">Identificación:</span>
                            <span className="detail-value">{candidato.identificacion}</span>
                        </div>

                        <div className="detail-item">
                            <span className="detail-label">Nacionalidad:</span>
                            <span className="detail-value">{candidato.nacionalidad}</span>
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
                    </div>

                    <div className="actions-row mt-3">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={verCurriculo}
                            disabled={!candidato.cvDisponible}
                        >
                            Ver currículo PDF
                        </button>

                        <Link to="/empresa/candidatos" className="btn btn-secondary">
                            Volver a candidatos
                        </Link>
                    </div>
                </div>

                <aside className="info-card">
                    <h3 className="card-title">Habilidades registradas</h3>

                    <ul className="simple-list">
                        {candidato.habilidades.map((habilidad, index) => (
                            <li key={index}>{habilidad}</li>
                        ))}
                    </ul>
                </aside>
            </section>
        </>
    );
}

export default DetalleCandidatoPage;