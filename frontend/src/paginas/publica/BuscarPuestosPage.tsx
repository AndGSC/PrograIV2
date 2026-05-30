import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';

function BuscarPuestosPage() {
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [nivel, setNivel] = useState('');
    const [mensaje, setMensaje] = useState('');

    const puestosEncontrados = [
        {
            id: 1,
            empresa: 'Empresa Demo',
            puesto: 'Desarrollador Frontend',
            salario: '₡850 000',
            tipo: 'Pública'
        },
        {
            id: 2,
            empresa: 'Tecnologías UNA',
            puesto: 'Programador Java Junior',
            salario: '₡900 000',
            tipo: 'Pública'
        }
    ];

    function buscarPuestos(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensaje('La búsqueda se conectará luego con el backend REST.');
    }

    function limpiarBusqueda() {
        setTextoBusqueda('');
        setNivel('');
        setMensaje('');
    }

    return (
        <>
            <PageHeader
                titulo="Buscar puestos"
                subtitulo="Busque puestos públicos según características o palabras clave"
            />

            <MessageBox tipo="info" mensaje={mensaje} />

            <section className="filters-card">
                <form onSubmit={buscarPuestos}>
                    <div className="filter-grid">
                        <div className="form-group">
                            <label htmlFor="textoBusqueda">Palabra clave</label>
                            <input
                                id="textoBusqueda"
                                type="text"
                                value={textoBusqueda}
                                onChange={(event) => setTextoBusqueda(event.target.value)}
                                placeholder="Ejemplo: Java, React, soporte técnico"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nivel">Nivel</label>
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
                    <span className="text-muted">{puestosEncontrados.length} puestos encontrados</span>
                </div>

                {puestosEncontrados.length === 0 ? (
                    <EmptyState mensaje="No se encontraron puestos con los criterios indicados." />
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Empresa</th>
                                <th>Puesto</th>
                                <th>Salario</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>

                            <tbody>
                            {puestosEncontrados.map((puesto) => (
                                <tr key={puesto.id}>
                                    <td>{puesto.empresa}</td>
                                    <td>{puesto.puesto}</td>
                                    <td>{puesto.salario}</td>
                                    <td>
                                            <span className="badge badge-info">
                                                {puesto.tipo}
                                            </span>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/puestos/${puesto.id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Ver detalle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}

export default BuscarPuestosPage;