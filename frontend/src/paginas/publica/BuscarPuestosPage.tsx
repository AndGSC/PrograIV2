import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';

import { buscarPuestos as buscarPuestosApi } from '../../api/publicApi';
import { ApiError } from '../../api/http';

import type { PuestoPublico } from '../../tipos/puesto';

function BuscarPuestosPage() {
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [nivel, setNivel] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [puestosEncontrados, setPuestosEncontrados] = useState<PuestoPublico[]>([]);

    async function buscarPuestos(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('');
        setTipoMensaje('info');
        setCargando(true);
        setBusquedaRealizada(true);

        try {
            const resultados = await buscarPuestosApi({
                textoBusqueda,
                nivel
            });

            setPuestosEncontrados(resultados || []);

            if (!resultados || resultados.length === 0) {
                setTipoMensaje('info');
                setMensaje('No se encontraron puestos con los criterios indicados.');
            }
        } catch (error) {
            setPuestosEncontrados([]);
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo realizar la búsqueda de puestos.');
            }
        } finally {
            setCargando(false);
        }
    }

    function limpiarBusqueda() {
        setTextoBusqueda('');
        setNivel('');
        setMensaje('');
        setTipoMensaje('info');
        setPuestosEncontrados([]);
        setBusquedaRealizada(false);
    }

    return (
        <>
            <PageHeader
                titulo="Buscar puestos"
                subtitulo="Busque puestos públicos según características o palabras clave"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

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
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={cargando}
                            >
                                {cargando ? 'Buscando...' : 'Buscar'}
                            </button>
                        </div>

                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={limpiarBusqueda}
                                disabled={cargando}
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </form>
            </section>

            {cargando ? (
                <Loading mensaje="Buscando puestos..." />
            ) : (
                <section className="section-block">
                    <div className="search-results-header">
                        <h2 className="section-title mb-0">Resultados</h2>

                        {busquedaRealizada && (
                            <span className="text-muted">
                                {puestosEncontrados.length} puestos encontrados
                            </span>
                        )}
                    </div>

                    {!busquedaRealizada ? (
                        <EmptyState mensaje="Ingrese criterios de búsqueda y presione el botón Buscar." />
                    ) : puestosEncontrados.length === 0 ? (
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
            )}
        </>
    );
}

export default BuscarPuestosPage;