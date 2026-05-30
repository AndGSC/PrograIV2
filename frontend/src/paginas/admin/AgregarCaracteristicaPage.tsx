import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import { crearCaracteristica } from '../../api/adminApi';
import { ApiError } from '../../api/http';

function AgregarCaracteristicaPage() {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(false);

    function limpiarFormulario() {
        setNombre('');
        setCategoria('');
        setDescripcion('');
        setMensaje('');
        setTipoMensaje('success');
    }

    async function guardarCaracteristica(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('');
        setTipoMensaje('info');
        setCargando(true);

        try {
            await crearCaracteristica({
                nombre,
                categoria,
                descripcion
            });

            setNombre('');
            setCategoria('');
            setDescripcion('');

            setTipoMensaje('success');
            setMensaje('Característica registrada correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo registrar la característica.');
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Agregar característica"
                subtitulo="Registre una característica que podrá usarse en puestos y habilidades"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando && (
                <Loading mensaje="Guardando característica..." />
            )}

            <div className="form-wrapper">
                <form className="form-card" onSubmit={guardarCaracteristica}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre de la característica</label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)}
                            placeholder="Ejemplo: Java, React, SQL"
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoria">Categoría principal</label>
                        <input
                            id="categoria"
                            type="text"
                            value={categoria}
                            onChange={(event) => setCategoria(event.target.value)}
                            placeholder="Ejemplo: Lenguajes de programación"
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(event) => setDescripcion(event.target.value)}
                            placeholder="Descripción opcional de la característica"
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={cargando}
                        >
                            {cargando ? 'Guardando...' : 'Guardar característica'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={limpiarFormulario}
                            disabled={cargando}
                        >
                            Limpiar
                        </button>

                        <Link to="/admin/caracteristicas" className="btn btn-outline-dark">
                            Volver
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AgregarCaracteristicaPage;