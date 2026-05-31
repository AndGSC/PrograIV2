import React from 'react';
import { Link } from 'react-router-dom';

import type { Candidato } from '../../tipos/candidato';

interface CandidatoCardProps {
    candidato: Candidato;
    detalleUrl?: string;
    textoBoton?: string;
}

function CandidatoCard({
                           candidato,
                           detalleUrl,
                           textoBoton = 'Ver detalle'
                       }: CandidatoCardProps) {
    const urlDetalle = detalleUrl || `/empresa/candidatos/${candidato.id}`;

    return (
        <article className="company-card">
            <h3 className="company-name">{candidato.nombre}</h3>

            <p className="company-meta">
                <strong>Correo:</strong> {candidato.correo}
            </p>

            <p className="company-meta">
                <strong>Teléfono:</strong> {candidato.telefono}
            </p>

            <p className="company-meta">
                <strong>Residencia:</strong> {candidato.residencia}
            </p>

            <p>
                <span className="badge badge-success">
                    {candidato.coincidencia}% de coincidencia
                </span>
            </p>

            {candidato.cvDisponible !== undefined && (
                <p>
                    <span
                        className={
                            candidato.cvDisponible
                                ? 'badge badge-success'
                                : 'badge badge-neutral'
                        }
                    >
                        {candidato.cvDisponible ? 'CV disponible' : 'Sin CV'}
                    </span>
                </p>
            )}

            {candidato.habilidades && candidato.habilidades.length > 0 ? (
                <ul className="simple-list">
                    {candidato.habilidades.map((habilidad, index) => (
                        <li key={index}>{habilidad}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">
                    No hay habilidades registradas.
                </p>
            )}

            <div className="mt-2">
                <Link to={urlDetalle} className="btn btn-primary">
                    {textoBoton}
                </Link>
            </div>
        </article>
    );
}

export default CandidatoCard;