import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';
import EmptyState from '../../componentes/comunes/EmptyState';

function PuestosPublicosPage() {
    const puestosPublicos = [
        {
            id: 1,
            empresa: 'Empresa Demo',
            puesto: 'Desarrollador Frontend',
            salario: '₡850 000',
            tipo: 'Pública',
            descripcion: 'Puesto orientado al desarrollo de interfaces web.',
            caracteristicas: ['HTML - Intermedio', 'CSS - Intermedio', 'JavaScript - Intermedio']
        },
        {
            id: 2,
            empresa: 'Tecnologías UNA',
            puesto: 'Programador Java Junior',
            salario: '₡900 000',
            tipo: 'Pública',
            descripcion: 'Puesto orientado al desarrollo de servicios backend.',
            caracteristicas: ['Java - Intermedio', 'Spring - Básico', 'MySQL - Básico']
        }
    ];

    return (
        <>
            <PageHeader
                titulo="Puestos públicos"
                subtitulo="Últimos puestos públicos registrados por empresas"
            />

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

                                    <Link to={`/puestos/${puesto.id}`} className="job-detail-btn">
                                        Ver detalle
                                    </Link>
                                </div>

                                <div className="job-hover-detail">
                                    <h4 className="job-hover-title">Características requeridas</h4>

                                    <p>{puesto.descripcion}</p>

                                    <ul className="job-feature-list">
                                        {puesto.caracteristicas.map((caracteristica, index) => (
                                            <li key={index}>{caracteristica}</li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default PuestosPublicosPage;