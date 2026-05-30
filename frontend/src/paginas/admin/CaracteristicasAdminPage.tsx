import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';
import EmptyState from '../../componentes/comunes/EmptyState';
import MessageBox from '../../componentes/comunes/MessageBox';

interface Caracteristica {
    id: number;
    nombre: string;
    categoria: string;
    estado: string;
}

function CaracteristicasAdminPage() {
    const [mensaje, setMensaje] = useState('');

    const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([
        {
            id: 1,
            nombre: 'Java',
            categoria: 'Lenguajes de programación',
            estado: 'Activa'
        },
        {
            id: 2,
            nombre: 'React',
            categoria: 'Tecnologías Web',
            estado: 'Activa'
        },
        {
            id: 3,
            nombre: 'MySQL',
            categoria: 'Bases de datos',
            estado: 'Activa'
        }
    ]);

    function desactivarCaracteristica(id: number) {
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
        setMensaje('Característica desactivada correctamente.');
    }

    return (
        <>
            <PageHeader
                titulo="Características"
                subtitulo="Administre las características que se usarán en puestos y habilidades"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

            <section className="section-block">
                <div className="actions-row">
                    <Link to="/admin/caracteristicas/nueva" className="btn btn-primary">
                        Agregar característica
                    </Link>
                </div>
            </section>

            {caracteristicas.length === 0 ? (
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
                                        <span
                                            className={
                                                caracteristica.estado === 'Activa'
                                                    ? 'badge badge-success'
                                                    : 'badge badge-neutral'
                                            }
                                        >
                                            {caracteristica.estado}
                                        </span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => desactivarCaracteristica(caracteristica.id)}
                                        disabled={caracteristica.estado === 'Inactiva'}
                                    >
                                        Desactivar
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