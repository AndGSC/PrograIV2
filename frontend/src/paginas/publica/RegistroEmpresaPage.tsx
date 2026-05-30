import React, { FormEvent, useState } from 'react';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';

function RegistroEmpresaPage() {
    const [nombre, setNombre] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [clave, setClave] = useState('');
    const [mensaje, setMensaje] = useState('');

    function registrarEmpresa(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensaje('El registro de empresa se conectará luego con el backend REST.');
    }

    function limpiarFormulario() {
        setNombre('');
        setLocalizacion('');
        setCorreo('');
        setTelefono('');
        setDescripcion('');
        setClave('');
        setMensaje('');
    }

    return (
        <>
            <PageHeader
                titulo="Registro de empresa"
                subtitulo="Complete la información para solicitar el registro de la empresa"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

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
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Enviar solicitud
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={limpiarFormulario}
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