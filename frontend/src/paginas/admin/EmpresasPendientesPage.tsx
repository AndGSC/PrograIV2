import React, { useEffect, useState } from 'react';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';

import {
    obtenerEmpresasPendientes,
    aprobarEmpresa as aprobarEmpresaApi,
    rechazarEmpresa as rechazarEmpresaApi
} from '../../api/adminApi';

import { ApiError } from '../../api/http';

import type { EmpresaPendiente } from '../../tipos/empresa';

function EmpresasPendientesPage() {
    const [empresas, setEmpresas] = useState<EmpresaPendiente[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(true);
    const [procesandoId, setProcesandoId] = useState<number | null>(null);

    useEffect(() => {
        async function cargarEmpresasPendientes() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerEmpresasPendientes();
                setEmpresas(datos || []);
            } catch (error) {
                setEmpresas([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudieron cargar las empresas pendientes.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarEmpresasPendientes();
    }, []);

    async function aprobarEmpresa(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setProcesandoId(id);

        try {
            await aprobarEmpresaApi(id);

            setEmpresas(empresas.filter((empresa) => empresa.id !== id));
            setTipoMensaje('success');
            setMensaje('Empresa aprobada correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo aprobar la empresa.');
            }
        } finally {
            setProcesandoId(null);
        }
    }

    async function rechazarEmpresa(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setProcesandoId(id);

        try {
            await rechazarEmpresaApi(id);

            setEmpresas(empresas.filter((empresa) => empresa.id !== id));
            setTipoMensaje('success');
            setMensaje('Empresa rechazada correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo rechazar la empresa.');
            }
        } finally {
            setProcesandoId(null);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Empresas pendientes"
                subtitulo="Revise y autorice las solicitudes de registro de empresas"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando empresas pendientes..." />
            ) : empresas.length === 0 ? (
                <EmptyState mensaje="No hay empresas pendientes de aprobación." />
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Localización</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>

                        <tbody>
                        {empresas.map((empresa) => (
                            <tr key={empresa.id}>
                                <td>{empresa.nombre}</td>
                                <td>{empresa.localizacion}</td>
                                <td>{empresa.correo}</td>
                                <td>{empresa.telefono}</td>
                                <td>{empresa.descripcion}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() => aprobarEmpresa(empresa.id)}
                                            disabled={procesandoId === empresa.id}
                                        >
                                            {procesandoId === empresa.id
                                                ? 'Procesando...'
                                                : 'Aprobar'}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => rechazarEmpresa(empresa.id)}
                                            disabled={procesandoId === empresa.id}
                                        >
                                            {procesandoId === empresa.id
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

export default EmpresasPendientesPage;