import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../../componentes/comunes/MessageBox';

function LoginPage() {
    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const [mensaje, setMensaje] = useState('');

    function iniciarSesion(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('El login se conectará luego con el backend y JWT.');

        /*
            Luego esto se reemplaza por authApi.login(correo, clave).

            localStorage.setItem('token', token);
            localStorage.setItem('rol', rol);
            localStorage.setItem('correo', correo);

            if (rol === 'ROLE_ADMIN') navigate('/admin');
            if (rol === 'ROLE_EMPRESA') navigate('/empresa');
            if (rol === 'ROLE_OFERENTE') navigate('/oferente');
        */

        if (correo.includes('admin')) {
            localStorage.setItem('token', 'token-demo');
            localStorage.setItem('rol', 'ROLE_ADMIN');
            localStorage.setItem('correo', correo);
            navigate('/admin');
            return;
        }

        if (correo.includes('empresa')) {
            localStorage.setItem('token', 'token-demo');
            localStorage.setItem('rol', 'ROLE_EMPRESA');
            localStorage.setItem('correo', correo);
            navigate('/empresa');
            return;
        }

        if (correo.includes('oferente')) {
            localStorage.setItem('token', 'token-demo');
            localStorage.setItem('rol', 'ROLE_OFERENTE');
            localStorage.setItem('correo', correo);
            navigate('/oferente');
            return;
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Iniciar sesión</h1>
                <p className="auth-subtitle">
                    Ingrese sus credenciales para acceder al sistema
                </p>

                <MessageBox tipo="info" mensaje={mensaje} />

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
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary w-100">
                            Ingresar
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