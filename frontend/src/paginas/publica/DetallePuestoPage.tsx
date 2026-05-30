import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';

function DetallePuestoPage() {
    const { id } = useParams();

    const puesto = {
        id,
        empresa: 'Empresa Demo',
        puesto: 'Desarrollador Frontend',
        salario: '₡850 000',
        tipo: 'Pública',
        descripcion: 'Puesto orientado al desarrollo de interfaces web para aplicaciones empresariales.',
        requisitos: [
            'HTML - Intermedio',
            'CSS - Intermedio',
            'JavaScript - Intermedio',
            'React - Básico'
        ]
    };

    return (
        <>
            <PageHeader
                titulo="Detalle del puesto"
                subtitulo="Información general y características requeridas"
            />

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
                            <p className="detail-value mt-1">{puesto.descripcion}</p>
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

                    <ul className="simple-list">
                        {puesto.requisitos.map((requisito, index) => (
                            <li key={index}>{requisito}</li>
                        ))}
                    </ul>
                </aside>
            </section>
        </>
    );
}

export default DetallePuestoPage;