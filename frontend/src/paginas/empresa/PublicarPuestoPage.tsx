import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';

function PublicarPuestoPage() {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [salario, setSalario] = useState('');
    const [tipoPublicacion, setTipoPublicacion] = useState('PUBLICA');
    const [caracteristica, setCaracteristica] = useState('');
    const [nivel, setNivel] = useState('');
    const [requisitos, setRequisitos] = useState<string[]>([]);
    const [mensaje, setMensaje] = useState('');

    function agregarRequisito() {
        if (caracteristica.trim() === '' || nivel.trim() === '') {
            setMensaje('Debe indicar una característica y un nivel.');
            return;
        }

        const nuevoRequisito = `${caracteristica} - ${nivel}`;

        setRequisitos([...requisitos, nuevoRequisito]);
        setCaracteristica('');
        setNivel('');
        setMensaje('');
    }

    function eliminarRequisito(indice: number) {
        setRequisitos(requisitos.filter((_, index) => index !== indice));
    }

    function publicarPuesto(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('El puesto se conectará luego con el backend REST.');

        setTitulo('');
        setDescripcion('');
        setSalario('');
        setTipoPublicacion('PUBLICA');
        setCaracteristica('');
        setNivel('');
        setRequisitos([]);
    }

    return (
        <>
            <PageHeader
                titulo="Publicar puesto"
                subtitulo="Registre un nuevo puesto disponible para la empresa"
            />

            <MessageBox tipo="info" mensaje={mensaje} />

            <div className="form-wrapper">
                <form className="form-card" onSubmit={publicarPuesto}>
                    <div className="form-group">
                        <label htmlFor="titulo">Título del puesto</label>
                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(event) => setTitulo(event.target.value)}
                            placeholder="Ejemplo: Desarrollador Frontend"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción general</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(event) => setDescripcion(event.target.value)}
                            placeholder="Describa las funciones principales del puesto"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="salario">Salario ofrecido</label>
                            <input
                                id="salario"
                                type="text"
                                value={salario}
                                onChange={(event) => setSalario(event.target.value)}
                                placeholder="Ejemplo: 850000"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipoPublicacion">Tipo de publicación</label>
                            <select
                                id="tipoPublicacion"
                                value={tipoPublicacion}
                                onChange={(event) => setTipoPublicacion(event.target.value)}
                            >
                                <option value="PUBLICA">Pública</option>
                                <option value="PRIVADA">Privada</option>
                            </select>
                        </div>
                    </div>

                    <div className="panel mt-2">
                        <div className="panel-header">
                            <h2 className="section-title mb-0">Características requeridas</h2>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="caracteristica">Característica</label>
                                <input
                                    id="caracteristica"
                                    type="text"
                                    value={caracteristica}
                                    onChange={(event) => setCaracteristica(event.target.value)}
                                    placeholder="Ejemplo: Java, React, SQL"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nivel">Nivel requerido</label>
                                <select
                                    id="nivel"
                                    value={nivel}
                                    onChange={(event) => setNivel(event.target.value)}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="Básico">Básico</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={agregarRequisito}
                            >
                                Agregar requisito
                            </button>
                        </div>

                        <div className="mt-2">
                            {requisitos.length === 0 ? (
                                <p className="text-muted">
                                    No se han agregado características requeridas.
                                </p>
                            ) : (
                                <ul className="simple-list">
                                    {requisitos.map((requisito, index) => (
                                        <li key={index}>
                                            <div className="search-results-header mb-0">
                                                <span>{requisito}</span>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminarRequisito(index)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="form-actions mt-3">
                        <button type="submit" className="btn btn-primary">
                            Publicar puesto
                        </button>

                        <Link to="/empresa/puestos" className="btn btn-secondary">
                            Volver
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default PublicarPuestoPage;