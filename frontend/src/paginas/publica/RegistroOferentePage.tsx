import React, { FormEvent, useState } from 'react';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';

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

    function registrarOferente(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensaje('El registro de oferente se conectará luego con el backend REST.');
    }

    return (
        <>
            <PageHeader
                titulo="Registro de oferente"
                subtitulo="Complete sus datos para solicitar el registro en la bolsa de empleo"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

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

                        <button type="reset" className="btn btn-secondary">
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default RegistroOferentePage;