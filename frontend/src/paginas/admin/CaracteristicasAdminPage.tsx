import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import EmptyState from '../../componentes/comunes/EmptyState';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import {
    obtenerCaracteristicas,
    desactivarCaracteristica as desactivarCaracteristicaApi
} from '../../api/adminApi';

import { ApiError } from '../../api/http';

import type { Caracteristica } from '../../tipos/caracteristica';

function obtenerTextoEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (
        estadoNormalizado === 'ACTIVA' ||
        estadoNormalizado === 'ACTIVO' ||
        estadoNormalizado === 'A'
    ) {
        return 'Activa';
    }

    if (
        estadoNormalizado === 'INACTIVA' ||
        estadoNormalizado === 'INACTIVO' ||
        estadoNormalizado === 'I'
    ) {
        return 'Inactiva';
    }

    return estado;
}

function obtenerClaseEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (
        estadoNormalizado === 'ACTIVA' ||
        estadoNormalizado === 'ACTIVO' ||
        estadoNormalizado === 'A'
    ) {
        return 'badge badge-success';
    }

    return 'badge badge-neutral';
}

function estaInactiva(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    return (
        estadoNormalizado === 'INACTIVA' ||
        estadoNormalizado === 'INACTIVO' ||
        estadoNormalizado === 'I'
    );
}

function CaracteristicasAdminPage() {
    const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(true);
    const [desactivandoId, setDesactivandoId] = useState<number | null>(null);

    useEffect(() => {
        async function cargarCaracteristicas() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerCaracteristicas();
                setCaracteristicas(datos || []);
            } catch (error) {
                setCaracteristicas([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudieron cargar las características.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarCaracteristicas();
    }, []);

    async function desactivarCaracteristica(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setDesactivandoId(id);

        try {
            await desactivarCaracteristicaApi(id);

            const actualizadas = caracteristicas.map((caracteristica) => {
                if (caracteristica.id === id) {
                    return {
                        ...caracteristica,
                        estado: 'Inactiva'
                    };
                }

                return caracteristica;
            });

            setCaracteristicas(actualizadas);
            setTipoMensaje('success');
            setMensaje('Característica desactivada correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo desactivar la característica.');
            }
        } finally {
            setDesactivandoId(null);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Características"
                subtitulo="Administre las características que se usarán en puestos y habilidades"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            <section className="section-block">
                <div className="actions-row">
                    <Link to="/admin/caracteristicas/nueva" className="btn btn-primary">
                        Agregar característica
                    </Link>
                </div>
            </section>

            {cargando ? (
                <Loading mensaje="Cargando características..." />
            ) : caracteristicas.length === 0 ? (
                <EmptyState mensaje="No hay características registradas." />
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>

                        <tbody>
                        {caracteristicas.map((caracteristica) => (
                            <tr key={caracteristica.id}>
                                <td>{caracteristica.nombre}</td>
                                <td>{caracteristica.categoria}</td>
                                <td>
                                        <span className={obtenerClaseEstado(caracteristica.estado)}>
                                            {obtenerTextoEstado(caracteristica.estado)}
                                        </span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => desactivarCaracteristica(caracteristica.id)}
                                        disabled={
                                            estaInactiva(caracteristica.estado) ||
                                            desactivandoId === caracteristica.id
                                        }
                                    >
                                        {desactivandoId === caracteristica.id
                                            ? 'Desactivando...'
                                            : 'Desactivar'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default CaracteristicasAdminPage;