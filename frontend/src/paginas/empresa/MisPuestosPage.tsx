import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';

interface PuestoEmpresa {
    id: number;
    titulo: string;
    descripcion: string;
    salario: string;
    tipoPublicacion: string;
    estado: string;
}

function MisPuestosPage() {
    const [mensaje, setMensaje] = useState('');

    const [puestos, setPuestos] = useState<PuestoEmpresa[]>([
        {
            id: 1,
            titulo: 'Desarrollador Frontend',
            descripcion: 'Desarrollo de interfaces web con React.',
            salario: '₡850 000',
            tipoPublicacion: 'Pública',
            estado: 'Activo'
        },
        {
            id: 2,
            titulo: 'Programador Java Junior',
            descripcion: 'Desarrollo de servicios backend con Spring.',
            salario: '₡900 000',
            tipoPublicacion: 'Privada',
            estado: 'Activo'
        },
        {
            id: 3,
            titulo: 'Soporte técnico',
            descripcion: 'Atención de incidencias y soporte a usuarios.',
            salario: '₡650 000',
            tipoPublicacion: 'Pública',
            estado: 'Inactivo'
        }
    ]);

    function desactivarPuesto(id: number) {
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
        setMensaje('Puesto desactivado correctamente.');
    }

    return (
        <>
            <PageHeader
                titulo="Mis puestos"
                subtitulo="Listado de puestos publicados por la empresa"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

            <section className="section-block">
                <div className="actions-row">
                    <Link to="/empresa/puestos/nuevo" className="btn btn-primary">
                        Publicar nuevo puesto
                    </Link>
                </div>
            </section>

            {puestos.length === 0 ? (
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
                                            {puesto.tipoPublicacion}
                                        </span>
                                </td>
                                <td>
                                        <span
                                            className={
                                                puesto.estado === 'Activo'
                                                    ? 'badge badge-success'
                                                    : 'badge badge-neutral'
                                            }
                                        >
                                            {puesto.estado}
                                        </span>
                                </td>
                                <td>
                                    <div className="table-actions">
                                        <Link
                                            to="/empresa/candidatos"
                                            className="btn btn-primary btn-sm"
                                        >
                                            Buscar candidatos
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => desactivarPuesto(puesto.id)}
                                            disabled={puesto.estado === 'Inactivo'}
                                        >
                                            Desactivar
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