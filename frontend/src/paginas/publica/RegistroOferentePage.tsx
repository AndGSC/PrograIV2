import React, { FormEvent, useState } from 'react';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import { registrarOferente as registrarOferenteApi } from '../../api/publicApi';
import { ApiError } from '../../api/http';

function RegistroOferentePage() {
    const [identificacion, setIdentificacion] = useState('');
    const [nombre, setNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [residencia, setResidencia] = useState('');
    const [clave, setClave] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(false);

    async function registrarOferente(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('');
        setTipoMensaje('info');
        setCargando(true);

        try {
            await registrarOferenteApi({
                identificacion,
                nombre,
                primerApellido,
                nacionalidad,
                telefono,
                correo,
                residencia,
                clave
            });

            setIdentificacion('');
            setNombre('');
            setPrimerApellido('');
            setNacionalidad('');
            setTelefono('');
            setCorreo('');
            setResidencia('');
            setClave('');

            setTipoMensaje('success');
            setMensaje('Solicitud de registro enviada correctamente. Debe esperar la aprobación del administrador.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo registrar el oferente. Intente nuevamente.');
            }
        } finally {
            setCargando(false);
        }
    }

    function limpiarFormulario() {
        setIdentificacion('');
        setNombre('');
        setPrimerApellido('');
        setNacionalidad('');
        setTelefono('');
        setCorreo('');
        setResidencia('');
        setClave('');
        setMensaje('');
        setTipoMensaje('success');
    }

    return (
        <>
            <PageHeader
                titulo="Registro de oferente"
                subtitulo="Complete sus datos para solicitar el registro en la bolsa de empleo"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando && (
                <Loading mensaje="Enviando solicitud de registro..." />
            )}

            <div className="form-wrapper">
                <form className="form-card" onSubmit={registrarOferente}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="identificacion">Identificación</label>
                            <input
                                id="identificacion"
                                type="text"
                                value={identificacion}
                                onChange={(event) => setIdentificacion(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(event) => setNombre(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="primerApellido">Primer apellido</label>
                            <input
                                id="primerApellido"
                                type="text"
                                value={primerApellido}
                                onChange={(event) => setPrimerApellido(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nacionalidad">Nacionalidad</label>
                            <input
                                id="nacionalidad"
                                type="text"
                                value={nacionalidad}
                                onChange={(event) => setNacionalidad(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                id="telefono"
                                type="text"
                                value={telefono}
                                onChange={(event) => setTelefono(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="correo">Correo electrónico</label>
                            <input
                                id="correo"
                                type="email"
                                value={correo}
                                onChange={(event) => setCorreo(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="residencia">Lugar de residencia</label>
                        <input
                            id="residencia"
                            type="text"
                            value={residencia}
                            onChange={(event) => setResidencia(event.target.value)}
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="clave">Clave</label>
                        <input
                            id="clave"
                            type="password"
                            value={clave}
                            onChange={(event) => setClave(event.target.value)}
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={cargando}
                        >
                            {cargando ? 'Enviando...' : 'Enviar solicitud'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={limpiarFormulario}
                            disabled={cargando}
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default RegistroOferentePage;