import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import { login } from '../../api/authApi';
import { ApiError } from '../../api/http';

import {
    guardarSesion,
    normalizarRol,
    obtenerRutaPorRol
} from '../../utils/authStorage';

function LoginPage() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(false);

    async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('');
        setTipoMensaje('info');
        setCargando(true);

        try {
            const respuesta = await login({
                correo,
                clave
            });

            const rolNormalizado = normalizarRol(respuesta.rol);

            guardarSesion(
                respuesta.token,
                rolNormalizado,
                respuesta.correo
            );

            const rutaDestino = obtenerRutaPorRol(rolNormalizado);

            navigate(rutaDestino);
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo iniciar sesión. Intente nuevamente.');
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Iniciar sesión</h1>

                <p className="auth-subtitle">
                    Ingrese sus credenciales para acceder al sistema
                </p>

                <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

                {cargando && (
                    <Loading mensaje="Validando credenciales..." />
                )}

                <form onSubmit={iniciarSesion}>
                    <div className="form-group">
                        <label htmlFor="correo">Correo electrónico</label>
                        <input
                            id="correo"
                            type="email"
                            value={correo}
                            onChange={(event) => setCorreo(event.target.value)}
                            placeholder="correo@ejemplo.com"
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
                            placeholder="Ingrese su clave"
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={cargando}
                        >
                            {cargando ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </div>
                </form>

                <div className="mt-2 text-center">
                    <p className="text-muted">
                        ¿No tiene cuenta?
                    </p>

                    <div className="actions-row">
                        <Link to="/registro-empresa" className="btn btn-secondary">
                            Registrar empresa
                        </Link>

                        <Link to="/registro-oferente" className="btn btn-secondary">
                            Registrar oferente
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;