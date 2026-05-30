import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../componentes/comunes/PageHeader';

function NotFoundPage() {
    return (
        <div className="route-guard-message">
            <PageHeader
                titulo="Página no encontrada"
                subtitulo="La ruta solicitada no existe dentro del sistema"
            />

            <div className="content-card">
                <p>
                    Verifique la dirección ingresada o vuelva a la página principal.
                </p>

                <div className="actions-row mt-2">
                    <Link to="/" className="btn btn-primary">
                        Volver al inicio
                    </Link>

                    <Link to="/login" className="btn btn-secondary">
                        Iniciar sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;