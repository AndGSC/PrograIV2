import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PuestoDetalleModal from './PuestoDetalleModal';

import type { PuestoPublico } from '../../tipos/puesto';

interface PuestoCardProps {
    puesto: PuestoPublico;
    detalleUrl?: string;
}

// Función helper para formatear el salario con ambas monedas
function formatearSalario(puesto: PuestoPublico): React.ReactNode | string {
    if (puesto.salarioDolares && puesto.salarioColones) {
        return (
            <div style={{ lineHeight: '1.4' }}>
                <div>${parseFloat(puesto.salarioDolares).toLocaleString('es-CR', { minimumFractionDigits: 2 })} USD</div>
                <div>₡{parseFloat(puesto.salarioColones).toLocaleString('es-CR', { minimumFractionDigits: 0 })} CRC</div>
            </div>
        );
    }
    return puesto.salario || 'N/A';
}

function PuestoCard({ puesto, detalleUrl }: PuestoCardProps) {
    const [openDetalle, setOpenDetalle] = useState(false);
    const urlDetalle = detalleUrl || `/puestos/${puesto.id}`;

    return (
        <article className="job-card">
            <div className="job-card-body">
                <h3 className="job-company">{puesto.empresa}</h3>

                <p className="job-position">{puesto.puesto}</p>

                <p className="job-salary">{formatearSalario(puesto)}</p>

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
                {/* Botón dentro del panel que aparece al hacer hover para ver el detalle completo */}
                <div className="mt-2">
                    <button type="button" className="btn btn-primary" onClick={() => setOpenDetalle(true)}>
                        Ver detalle completo
                    </button>
                </div>
            </div>

            {/* Modal de detalle completo */}
            <PuestoDetalleModal
                puesto={puesto}
                open={openDetalle}
                onClose={() => setOpenDetalle(false)}
            />
        </article>
    );
}

export default PuestoCard;