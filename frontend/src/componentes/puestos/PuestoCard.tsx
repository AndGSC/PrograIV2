import React from 'react';
import { Link } from 'react-router-dom';

import type { PuestoPublico } from '../../tipos/puesto';

interface PuestoCardProps {
    puesto: PuestoPublico;
    detalleUrl?: string;
}

function PuestoCard({ puesto, detalleUrl }: PuestoCardProps) {
    const urlDetalle = detalleUrl || `/puestos/${puesto.id}`;

    return (
        <article className="job-card">
            <div className="job-card-body">
                <h3 className="job-company">{puesto.empresa}</h3>

                <p className="job-position">{puesto.puesto}</p>

                <p className="job-salary">{puesto.salario}</p>

                <span className="badge badge-info job-type">
                    {puesto.tipo}
                </span>

                <Link to={urlDetalle} className="job-detail-btn">
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
    );
}

export default PuestoCard;