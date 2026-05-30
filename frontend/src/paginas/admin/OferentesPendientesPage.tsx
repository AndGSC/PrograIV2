import React, { useEffect, useState } from 'react';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';

import {
    obtenerOferentesPendientes,
    aprobarOferente as aprobarOferenteApi,
    rechazarOferente as rechazarOferenteApi
} from '../../api/adminApi';

import { ApiError } from '../../api/http';

import type { OferentePendiente } from '../../tipos/oferente';

function OferentesPendientesPage() {
    const [oferentes, setOferentes] = useState<OferentePendiente[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(true);
    const [procesandoId, setProcesandoId] = useState<number | null>(null);

    useEffect(() => {
        async function cargarOferentesPendientes() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerOferentesPendientes();
                setOferentes(datos || []);
            } catch (error) {
                setOferentes([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudieron cargar los oferentes pendientes.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarOferentesPendientes();
    }, []);

    async function aprobarOferente(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setProcesandoId(id);

        try {
            await aprobarOferenteApi(id);

            setOferentes(oferentes.filter((oferente) => oferente.id !== id));
            setTipoMensaje('success');
            setMensaje('Oferente aprobado correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo aprobar el oferente.');
            }
        } finally {
            setProcesandoId(null);
        }
    }

    async function rechazarOferente(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setProcesandoId(id);

        try {
            await rechazarOferenteApi(id);

            setOferentes(oferentes.filter((oferente) => oferente.id !== id));
            setTipoMensaje('success');
            setMensaje('Oferente rechazado correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo rechazar el oferente.');
            }
        } finally {
            setProcesandoId(null);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Oferentes pendientes"
                subtitulo="Revise y autorice las solicitudes de registro de oferentes"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando oferentes pendientes..." />
            ) : oferentes.length === 0 ? (
                <EmptyState mensaje="No hay oferentes pendientes de aprobación." />
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre</th>
                            <th>Nacionalidad</th>
                            <th>Teléfono</th>
                            <th>Correo</th>
                            <th>Residencia</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>

                        <tbody>
                        {oferentes.map((oferente) => (
                            <tr key={oferente.id}>
                                <td>{oferente.identificacion}</td>
                                <td>
                                    {oferente.nombre} {oferente.primerApellido}
                                </td>
                                <td>{oferente.nacionalidad}</td>
                                <td>{oferente.telefono}</td>
                                <td>{oferente.correo}</td>
                                <td>{oferente.residencia}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() => aprobarOferente(oferente.id)}
                                            disabled={procesandoId === oferente.id}
                                        >
                                            {procesandoId === oferente.id
                                                ? 'Procesando...'
                                                : 'Aprobar'}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => rechazarOferente(oferente.id)}
                                            disabled={procesandoId === oferente.id}
                                        >
                                            {procesandoId === oferente.id
                                                ? 'Procesando...'
                                                : 'Rechazar'}
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

export default OferentesPendientesPage;