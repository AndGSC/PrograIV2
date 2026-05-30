import React, { FormEvent, useState } from 'react';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import { registrarEmpresa as registrarEmpresaApi } from '../../api/publicApi';
import { ApiError } from '../../api/http';

function RegistroEmpresaPage() {
    const [nombre, setNombre] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [clave, setClave] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(false);

    async function registrarEmpresa(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('');
        setTipoMensaje('info');
        setCargando(true);

        try {
            await registrarEmpresaApi({
                nombre,
                localizacion,
                correo,
                telefono,
                descripcion,
                clave
            });

            setNombre('');
            setLocalizacion('');
            setCorreo('');
            setTelefono('');
            setDescripcion('');
            setClave('');

            setTipoMensaje('success');
            setMensaje('Solicitud de registro enviada correctamente. Debe esperar la aprobación del administrador.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo registrar la empresa. Intente nuevamente.');
            }
        } finally {
            setCargando(false);
        }
    }

    function limpiarFormulario() {
        setNombre('');
        setLocalizacion('');
        setCorreo('');
        setTelefono('');
        setDescripcion('');
        setClave('');
        setMensaje('');
        setTipoMensaje('success');
    }

    return (
        <>
            <PageHeader
                titulo="Registro de empresa"
                subtitulo="Complete la información para solicitar el registro de la empresa"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando && (
                <Loading mensaje="Enviando solicitud de registro..." />
            )}

            <div className="form-wrapper">
                <form className="form-card" onSubmit={registrarEmpresa}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre de la empresa</label>
                            <input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(event) => setNombre(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="localizacion">Localización</label>
                            <input
                                id="localizacion"
                                type="text"
                                value={localizacion}
                                onChange={(event) => setLocalizacion(event.target.value)}
                                required
                                disabled={cargando}
                            />
                        </div>
                    </div>

                    <div className="form-row">
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
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(event) => setDescripcion(event.target.value)}
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

export default RegistroEmpresaPage;