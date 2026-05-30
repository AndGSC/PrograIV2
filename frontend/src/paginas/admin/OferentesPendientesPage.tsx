import React, { useState } from 'react';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';

interface OferentePendiente {
    id: number;
    identificacion: string;
    nombre: string;
    primerApellido: string;
    nacionalidad: string;
    telefono: string;
    correo: string;
    residencia: string;
}

function OferentesPendientesPage() {
    const [mensaje, setMensaje] = useState('');

    const [oferentes, setOferentes] = useState<OferentePendiente[]>([
        {
            id: 1,
            identificacion: '1-1111-1111',
            nombre: 'Carlos',
            primerApellido: 'Mora',
            nacionalidad: 'Costarricense',
            telefono: '8888-1111',
            correo: 'carlos@correo.com',
            residencia: 'Alajuela'
        },
        {
            id: 2,
            identificacion: '2-2222-2222',
            nombre: 'María',
            primerApellido: 'Soto',
            nacionalidad: 'Costarricense',
            telefono: '8888-2222',
            correo: 'maria@correo.com',
            residencia: 'Cartago'
        }
    ]);

    function aprobarOferente(id: number) {
        setOferentes(oferentes.filter((oferente) => oferente.id !== id));
        setMensaje('Oferente aprobado correctamente.');
    }

    function rechazarOferente(id: number) {
        setOferentes(oferentes.filter((oferente) => oferente.id !== id));
        setMensaje('Oferente rechazado correctamente.');
    }

    return (
        <>
            <PageHeader
                titulo="Oferentes pendientes"
                subtitulo="Revise y autorice las solicitudes de registro de oferentes"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

            {oferentes.length === 0 ? (
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
                                        >
                                            Aprobar
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => rechazarOferente(oferente.id)}
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

export default OferentesPendientesPage;