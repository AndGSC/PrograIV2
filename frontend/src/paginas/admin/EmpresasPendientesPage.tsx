import React, { useState } from 'react';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';

interface EmpresaPendiente {
    id: number;
    nombre: string;
    localizacion: string;
    correo: string;
    telefono: string;
    descripcion: string;
}

function EmpresasPendientesPage() {
    const [mensaje, setMensaje] = useState('');

    const [empresas, setEmpresas] = useState<EmpresaPendiente[]>([
        {
            id: 1,
            nombre: 'Empresa Demo',
            localizacion: 'San José',
            correo: 'empresa@demo.com',
            telefono: '2222-1111',
            descripcion: 'Empresa dedicada al desarrollo de soluciones tecnológicas.'
        },
        {
            id: 2,
            nombre: 'Servicios Profesionales CR',
            localizacion: 'Heredia',
            correo: 'contacto@servicioscr.com',
            telefono: '2266-4455',
            descripcion: 'Empresa enfocada en contratación de personal especializado.'
        }
    ]);

    function aprobarEmpresa(id: number) {
        setEmpresas(empresas.filter((empresa) => empresa.id !== id));
        setMensaje('Empresa aprobada correctamente.');
    }

    function rechazarEmpresa(id: number) {
        setEmpresas(empresas.filter((empresa) => empresa.id !== id));
        setMensaje('Empresa rechazada correctamente.');
    }

    return (
        <>
            <PageHeader
                titulo="Empresas pendientes"
                subtitulo="Revise y autorice las solicitudes de registro de empresas"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

            {empresas.length === 0 ? (
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
                                        >
                                            Aprobar
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => rechazarEmpresa(empresa.id)}
                                        >
                                            Rechazar
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