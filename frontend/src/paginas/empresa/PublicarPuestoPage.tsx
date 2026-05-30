import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import { publicarPuesto as publicarPuestoApi } from '../../api/empresaApi';
import { ApiError } from '../../api/http';

import type { RequisitoPuesto } from '../../tipos/puesto';

function obtenerTextoNivel(nivel: string) {
    if (nivel === 'BASICO') {
        return 'Básico';
    }

    if (nivel === 'INTERMEDIO') {
        return 'Intermedio';
    }

    if (nivel === 'AVANZADO') {
        return 'Avanzado';
    }

    return nivel;
}

function PublicarPuestoPage() {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [salario, setSalario] = useState('');
    const [tipoPublicacion, setTipoPublicacion] = useState('PUBLICA');
    const [caracteristica, setCaracteristica] = useState('');
    const [nivel, setNivel] = useState('');
    const [requisitos, setRequisitos] = useState<RequisitoPuesto[]>([]);

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(false);

    function agregarRequisito() {
        if (caracteristica.trim() === '' || nivel.trim() === '') {
            setTipoMensaje('warning');
            setMensaje('Debe indicar una característica y un nivel.');
            return;
        }

        const caracteristicaLimpia = caracteristica.trim();

        const requisitoDuplicado = requisitos.some((requisito) => {
            return (
                requisito.caracteristica.toLowerCase() === caracteristicaLimpia.toLowerCase() &&
                requisito.nivel === nivel
            );
        });

        if (requisitoDuplicado) {
            setTipoMensaje('warning');
            setMensaje('Ese requisito ya fue agregado.');
            return;
        }

        const nuevoRequisito: RequisitoPuesto = {
            caracteristica: caracteristicaLimpia,
            nivel
        };

        setRequisitos([...requisitos, nuevoRequisito]);
        setCaracteristica('');
        setNivel('');
        setMensaje('');
        setTipoMensaje('info');
    }

    function eliminarRequisito(indice: number) {
        setRequisitos(requisitos.filter((_, index) => index !== indice));
        setMensaje('');
        setTipoMensaje('info');
    }

    function limpiarFormulario() {
        setTitulo('');
        setDescripcion('');
        setSalario('');
        setTipoPublicacion('PUBLICA');
        setCaracteristica('');
        setNivel('');
        setRequisitos([]);
        setMensaje('');
        setTipoMensaje('info');
    }

    async function publicarPuesto(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (requisitos.length === 0) {
            setTipoMensaje('warning');
            setMensaje('Debe agregar al menos una característica requerida.');
            return;
        }

        setMensaje('');
        setTipoMensaje('info');
        setCargando(true);

        try {
            await publicarPuestoApi({
                titulo,
                descripcion,
                salario,
                tipoPublicacion,
                requisitos
            });

            limpiarFormulario();

            setTipoMensaje('success');
            setMensaje('Puesto publicado correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo publicar el puesto.');
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Publicar puesto"
                subtitulo="Registre un nuevo puesto disponible para la empresa"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando && (
                <Loading mensaje="Publicando puesto..." />
            )}

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
                            disabled={cargando}
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
                            disabled={cargando}
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
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tipoPublicacion">Tipo de publicación</label>
                            <select
                                id="tipoPublicacion"
                                value={tipoPublicacion}
                                onChange={(event) => setTipoPublicacion(event.target.value)}
                                disabled={cargando}
                            >
                                <option value="PUBLICA">Pública</option>
                                <option value="PRIVADA">Privada</option>
                            </select>
                        </div>
                    </div>

                    <div className="panel mt-2">
                        <div className="panel-header">
                            <h2 className="section-title mb-0">
                                Características requeridas
                            </h2>
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
                                    disabled={cargando}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nivel">Nivel requerido</label>
                                <select
                                    id="nivel"
                                    value={nivel}
                                    onChange={(event) => setNivel(event.target.value)}
                                    disabled={cargando}
                                >
                                    <option value="">Seleccione</option>
                                    <option value="BASICO">Básico</option>
                                    <option value="INTERMEDIO">Intermedio</option>
                                    <option value="AVANZADO">Avanzado</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={agregarRequisito}
                                disabled={cargando}
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
                                                <span>
                                                    {requisito.caracteristica} - {obtenerTextoNivel(requisito.nivel)}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => eliminarRequisito(index)}
                                                    disabled={cargando}
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
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={cargando}
                        >
                            {cargando ? 'Publicando...' : 'Publicar puesto'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={limpiarFormulario}
                            disabled={cargando}
                        >
                            Limpiar
                        </button>

                        <Link to="/empresa/puestos" className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default PublicarPuestoPage;