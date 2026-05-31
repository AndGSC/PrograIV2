import React, { FormEvent, useEffect, useState } from 'react';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';
import CaracteristicasSelector from '../../componentes/caracteristicas/CaracteristicasSelector';

import {
    obtenerMisHabilidades,
    agregarHabilidad as agregarHabilidadApi,
    eliminarHabilidad as eliminarHabilidadApi
} from '../../api/oferenteApi';

import { ApiError } from '../../api/http';

import type { Habilidad } from '../../tipos/caracteristica';

function obtenerTextoNivel(nivel: string) {
    if (nivel === 'BASICO') {
        return 'Básico';
    }

    if (nivel === 'INTERMEDIO') {
        return 'Intermedio';
    }

    if (nivel === 'AVANZADO') {
        return 'Avanzado';
    }

    return nivel;
}

function MisHabilidadesPage() {
    const [caracteristica, setCaracteristica] = useState('');
    const [nivel, setNivel] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');

    const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [eliminandoId, setEliminandoId] = useState<number | null>(null);

    useEffect(() => {
        async function cargarHabilidades() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerMisHabilidades();
                setHabilidades(datos || []);
            } catch (error) {
                setHabilidades([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudieron cargar las habilidades.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarHabilidades();
    }, []);

    async function agregarHabilidad(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (caracteristica.trim() === '' || nivel.trim() === '') {
            setTipoMensaje('warning');
            setMensaje('Debe indicar una característica y un nivel.');
            return;
        }

        const caracteristicaLimpia = caracteristica.trim();

        const habilidadDuplicada = habilidades.some((habilidad) => {
            return (
                habilidad.caracteristica.toLowerCase() === caracteristicaLimpia.toLowerCase() &&
                habilidad.nivel === nivel
            );
        });

        if (habilidadDuplicada) {
            setTipoMensaje('warning');
            setMensaje('Esa habilidad ya fue registrada.');
            return;
        }

        setMensaje('');
        setTipoMensaje('info');
        setGuardando(true);

        try {
            const nuevaHabilidad = await agregarHabilidadApi({
                caracteristica: caracteristicaLimpia,
                nivel
            });

            setHabilidades([...habilidades, nuevaHabilidad]);
            setCaracteristica('');
            setNivel('');
            setTipoMensaje('success');
            setMensaje('Habilidad agregada correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo agregar la habilidad.');
            }
        } finally {
            setGuardando(false);
        }
    }

    async function eliminarHabilidad(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setEliminandoId(id);

        try {
            await eliminarHabilidadApi(id);

            setHabilidades(habilidades.filter((habilidad) => habilidad.id !== id));
            setTipoMensaje('success');
            setMensaje('Habilidad eliminada correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo eliminar la habilidad.');
            }
        } finally {
            setEliminandoId(null);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Mis habilidades"
                subtitulo="Registre o actualice sus características y niveles de dominio"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando habilidades registradas..." />
            ) : (
                <section className="feature-layout">
                    <div className="content-card">
                        <h2 className="section-title">Habilidades registradas</h2>

                        {habilidades.length === 0 ? (
                            <EmptyState mensaje="No hay habilidades registradas." />
                        ) : (
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>Característica</th>
                                        <th>Nivel</th>
                                        <th>Acciones</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {habilidades.map((habilidad) => (
                                        <tr key={habilidad.id}>
                                            <td>{habilidad.caracteristica}</td>
                                            <td>
                                                    <span className="badge badge-info">
                                                        {obtenerTextoNivel(habilidad.nivel)}
                                                    </span>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminarHabilidad(habilidad.id)}
                                                    disabled={eliminandoId === habilidad.id || guardando}
                                                >
                                                    {eliminandoId === habilidad.id
                                                        ? 'Eliminando...'
                                                        : 'Eliminar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <aside className="form-card">
                        <h2 className="section-title">Agregar habilidad</h2>

                        <form onSubmit={agregarHabilidad}>
                            <CaracteristicasSelector
                                caracteristica={caracteristica}
                                nivel={nivel}
                                onCaracteristicaChange={setCaracteristica}
                                onNivelChange={setNivel}
                                disabled={guardando}
                                idPrefijo="habilidad-oferente"
                                placeholder="Ejemplo: Java, React, SQL"
                            />

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={guardando}
                                >
                                    {guardando ? 'Agregando...' : 'Agregar habilidad'}
                                </button>
                            </div>
                        </form>
                    </aside>
                </section>
            )}
        </>
    );
}

export default MisHabilidadesPage;