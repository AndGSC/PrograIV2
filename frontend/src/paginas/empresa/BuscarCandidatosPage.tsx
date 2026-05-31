import React, { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';
import CandidatoCard from '../../componentes/candidatos/CandidatoCard';

import { buscarCandidatos as buscarCandidatosApi } from '../../api/empresaApi';
import { ApiError } from '../../api/http';

import type { Candidato } from '../../tipos/candidato';

function BuscarCandidatosPage() {
    const [searchParams] = useSearchParams();

    const puestoIdParam = searchParams.get('puestoId');
    const puestoId = puestoIdParam ? Number(puestoIdParam) : undefined;

    const [palabraClave, setPalabraClave] = useState('');
    const [nivel, setNivel] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);

    async function buscarCandidatos(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('');
        setTipoMensaje('info');
        setCargando(true);
        setBusquedaRealizada(true);

        try {
            const resultados = await buscarCandidatosApi({
                palabraClave,
                nivel,
                puestoId
            });

            setCandidatos(resultados || []);

            if (!resultados || resultados.length === 0) {
                setTipoMensaje('info');
                setMensaje('No se encontraron candidatos con los criterios indicados.');
            }
        } catch (error) {
            setCandidatos([]);
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo realizar la búsqueda de candidatos.');
            }
        } finally {
            setCargando(false);
        }
    }

    function limpiarBusqueda() {
        setPalabraClave('');
        setNivel('');
        setMensaje('');
        setTipoMensaje('info');
        setCandidatos([]);
        setBusquedaRealizada(false);
    }

    return (
        <>
            <PageHeader
                titulo="Buscar candidatos"
                subtitulo="Busque oferentes según habilidades y nivel de coincidencia"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {puestoId && (
                <section className="section-block">
                    <p className="text-muted mb-0">
                        La búsqueda se realizará tomando como referencia el puesto seleccionado.
                    </p>
                </section>
            )}

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
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nivel">Nivel mínimo</label>
                            <select
                                id="nivel"
                                value={nivel}
                                onChange={(event) => setNivel(event.target.value)}
                                disabled={cargando}
                            >
                                <option value="">Todos</option>
                                <option value="BASICO">Básico</option>
                                <option value="INTERMEDIO">Intermedio</option>
                                <option value="AVANZADO">Avanzado</option>
                            </select>
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
                <Loading mensaje="Buscando candidatos..." />
            ) : (
                <section className="section-block">
                    <div className="search-results-header">
                        <h2 className="section-title mb-0">Resultados</h2>

                        {busquedaRealizada && (
                            <span className="text-muted">
                                {candidatos.length} candidatos encontrados
                            </span>
                        )}
                    </div>

                    {!busquedaRealizada ? (
                        <EmptyState mensaje="Ingrese criterios de búsqueda y presione el botón Buscar." />
                    ) : candidatos.length === 0 ? (
                        <EmptyState mensaje="No se encontraron candidatos con los criterios indicados." />
                    ) : (
                        <div className="company-grid">
                            {candidatos.map((candidato) => (
                                <CandidatoCard
                                    key={candidato.id}
                                    candidato={candidato}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}
        </>
    );
}

export default BuscarCandidatosPage;