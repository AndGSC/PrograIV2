import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';

interface Candidato {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
    residencia: string;
    coincidencia: number;
    habilidades: string[];
}

function BuscarCandidatosPage() {
    const [palabraClave, setPalabraClave] = useState('');
    const [nivel, setNivel] = useState('');
    const [mensaje, setMensaje] = useState('');

    const candidatos: Candidato[] = [
        {
            id: 1,
            nombre: 'Carlos Mora',
            correo: 'carlos@correo.com',
            telefono: '8888-1111',
            residencia: 'Alajuela',
            coincidencia: 85,
            habilidades: ['Java - Intermedio', 'Spring - Básico', 'MySQL - Básico']
        },
        {
            id: 2,
            nombre: 'María Soto',
            correo: 'maria@correo.com',
            telefono: '8888-2222',
            residencia: 'Cartago',
            coincidencia: 92,
            habilidades: ['React - Intermedio', 'CSS - Avanzado', 'JavaScript - Intermedio']
        }
    ];

    function buscarCandidatos(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensaje('La búsqueda de candidatos se conectará luego con el backend REST.');
    }

    function limpiarBusqueda() {
        setPalabraClave('');
        setNivel('');
        setMensaje('');
    }

    return (
        <>
            <PageHeader
                titulo="Buscar candidatos"
                subtitulo="Busque oferentes según habilidades y nivel de coincidencia"
            />

            <MessageBox tipo="info" mensaje={mensaje} />

            <section className="filters-card">
                <form onSubmit={buscarCandidatos}>
                    <div className="filter-grid">
                        <div className="form-group">
                            <label htmlFor="palabraClave">Habilidad o característica</label>
                            <input
                                id="palabraClave"
                                type="text"
                                value={palabraClave}
                                onChange={(event) => setPalabraClave(event.target.value)}
                                placeholder="Ejemplo: Java, React, SQL"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nivel">Nivel mínimo</label>
                            <select
                                id="nivel"
                                value={nivel}
                                onChange={(event) => setNivel(event.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="BASICO">Básico</option>
                                <option value="INTERMEDIO">Intermedio</option>
                                <option value="AVANZADO">Avanzado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary w-100">
                                Buscar
                            </button>
                        </div>

                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={limpiarBusqueda}
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            <section className="section-block">
                <div className="search-results-header">
                    <h2 className="section-title mb-0">Resultados</h2>
                    <span className="text-muted">{candidatos.length} candidatos encontrados</span>
                </div>

                {candidatos.length === 0 ? (
                    <EmptyState mensaje="No se encontraron candidatos con los criterios indicados." />
                ) : (
                    <div className="company-grid">
                        {candidatos.map((candidato) => (
                            <article className="company-card" key={candidato.id}>
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

                                <ul className="simple-list">
                                    {candidato.habilidades.map((habilidad, index) => (
                                        <li key={index}>{habilidad}</li>
                                    ))}
                                </ul>

                                <div className="mt-2">
                                    <Link
                                        to={`/empresa/candidatos/${candidato.id}`}
                                        className="btn btn-primary"
                                    >
                                        Ver detalle
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default BuscarCandidatosPage;