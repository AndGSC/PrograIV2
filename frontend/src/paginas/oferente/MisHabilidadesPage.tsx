import React, { FormEvent, useState } from 'react';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';

interface Habilidad {
    id: number;
    caracteristica: string;
    nivel: string;
}

function MisHabilidadesPage() {
    const [caracteristica, setCaracteristica] = useState('');
    const [nivel, setNivel] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [habilidades, setHabilidades] = useState<Habilidad[]>([
        {
            id: 1,
            caracteristica: 'Java',
            nivel: 'Intermedio'
        },
        {
            id: 2,
            caracteristica: 'React',
            nivel: 'Básico'
        },
        {
            id: 3,
            caracteristica: 'MySQL',
            nivel: 'Intermedio'
        }
    ]);

    function agregarHabilidad(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (caracteristica.trim() === '' || nivel.trim() === '') {
            setMensaje('Debe indicar una característica y un nivel.');
            return;
        }

        const nuevaHabilidad: Habilidad = {
            id: Date.now(),
            caracteristica,
            nivel
        };

        setHabilidades([...habilidades, nuevaHabilidad]);
        setCaracteristica('');
        setNivel('');
        setMensaje('Habilidad agregada correctamente.');
    }

    function eliminarHabilidad(id: number) {
        setHabilidades(habilidades.filter((habilidad) => habilidad.id !== id));
        setMensaje('Habilidad eliminada correctamente.');
    }

    return (
        <>
            <PageHeader
                titulo="Mis habilidades"
                subtitulo="Registre o actualice sus características y niveles de dominio"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

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
                                                    {habilidad.nivel}
                                                </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarHabilidad(habilidad.id)}
                                            >
                                                Eliminar
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
                        <div className="form-group">
                            <label htmlFor="caracteristica">Característica</label>
                            <input
                                id="caracteristica"
                                type="text"
                                value={caracteristica}
                                onChange={(event) => setCaracteristica(event.target.value)}
                                placeholder="Ejemplo: Java, React, SQL"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nivel">Nivel</label>
                            <select
                                id="nivel"
                                value={nivel}
                                onChange={(event) => setNivel(event.target.value)}
                                required
                            >
                                <option value="">Seleccione</option>
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                Agregar habilidad
                            </button>
                        </div>
                    </form>
                </aside>
            </section>
        </>
    );
}

export default MisHabilidadesPage;