import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';

import {
    obtenerMisPuestos,
    desactivarPuesto as desactivarPuestoApi
} from '../../api/empresaApi';

import { ApiError } from '../../api/http';

import type { PuestoEmpresa } from '../../tipos/puesto';

function obtenerTextoEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (estadoNormalizado === 'ACTIVO') {
        return 'Activo';
    }

    if (estadoNormalizado === 'INACTIVO') {
        return 'Inactivo';
    }

    return estado;
}

function obtenerClaseEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (estadoNormalizado === 'ACTIVO') {
        return 'badge badge-success';
    }

    return 'badge badge-neutral';
}

function estaInactivo(estado: string) {
    return estado.trim().toUpperCase() === 'INACTIVO';
}

function obtenerTextoTipoPublicacion(tipoPublicacion: string) {
    const tipoNormalizado = tipoPublicacion.trim().toUpperCase();

    if (tipoNormalizado === 'PUBLICA') {
        return 'Pública';
    }

    if (tipoNormalizado === 'PRIVADA') {
        return 'Privada';
    }

    return tipoPublicacion;
}

function MisPuestosPage() {
    const [puestos, setPuestos] = useState<PuestoEmpresa[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(true);
    const [desactivandoId, setDesactivandoId] = useState<number | null>(null);

    useEffect(() => {
        async function cargarPuestos() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerMisPuestos();
                setPuestos(datos || []);
            } catch (error) {
                setPuestos([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudieron cargar los puestos de la empresa.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarPuestos();
    }, []);

    async function desactivarPuesto(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setDesactivandoId(id);

        try {
            await desactivarPuestoApi(id);

            const actualizados = puestos.map((puesto) => {
                if (puesto.id === id) {
                    return {
                        ...puesto,
                        estado: 'Inactivo'
                    };
                }

                return puesto;
            });

            setPuestos(actualizados);
            setTipoMensaje('success');
            setMensaje('Puesto desactivado correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo desactivar el puesto.');
            }
        } finally {
            setDesactivandoId(null);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Mis puestos"
                subtitulo="Listado de puestos publicados por la empresa"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            <section className="section-block">
                <div className="actions-row">
                    <Link to="/empresa/puestos/nuevo" className="btn btn-primary">
                        Publicar nuevo puesto
                    </Link>
                </div>
            </section>

            {cargando ? (
                <Loading mensaje="Cargando puestos publicados..." />
            ) : puestos.length === 0 ? (
                <EmptyState mensaje="No hay puestos publicados por la empresa." />
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Título</th>
                            <th>Descripción</th>
                            <th>Salario</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>

                        <tbody>
                        {puestos.map((puesto) => (
                            <tr key={puesto.id}>
                                <td>{puesto.titulo}</td>
                                <td>{puesto.descripcion}</td>
                                <td>{puesto.salario}</td>
                                <td>
                                        <span className="badge badge-info">
                                            {obtenerTextoTipoPublicacion(puesto.tipoPublicacion)}
                                        </span>
                                </td>
                                <td>
                                        <span className={obtenerClaseEstado(puesto.estado)}>
                                            {obtenerTextoEstado(puesto.estado)}
                                        </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <Link
                                            to={`/empresa/candidatos?puestoId=${puesto.id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Buscar candidatos
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => desactivarPuesto(puesto.id)}
                                            disabled={
                                                estaInactivo(puesto.estado) ||
                                                desactivandoId === puesto.id
                                            }
                                        >
                                            {desactivandoId === puesto.id
                                                ? 'Desactivando...'
                                                : 'Desactivar'}
                                        </button>
                                    </div>
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

export default MisPuestosPage;