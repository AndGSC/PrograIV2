import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';

function HomePage() {
    return (
        <>
            <PageHeader
                titulo="Bolsa de Empleo"
                subtitulo="Sistema para la publicación y búsqueda de puestos de trabajo"
            />

            <section className="section-block">
                <div className="content-card">
                    <h2 className="section-title">Bienvenido</h2>

                    <p>
                        Esta plataforma permite a las empresas publicar puestos de trabajo y a los oferentes
                        registrar sus habilidades para encontrar oportunidades laborales.
                    </p>

                    <div className="actions-row mt-2">
                        <Link to="/puestos-publicos" className="btn btn-primary">
                            Ver puestos públicos
                        </Link>

                        <Link to="/puestos" className="btn btn-secondary">
                            Buscar puestos
                        </Link>

                        <Link to="/login" className="btn btn-outline-dark">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section-block">
                <h2 className="section-title">Opciones disponibles</h2>

                <div className="grid-3">
                    <div className="info-card">
                        <h3 className="card-title">Empresas</h3>
                        <p className="card-text">
                            Registre su empresa, publique puestos y busque candidatos que coincidan
                            con los requisitos solicitados.
                        </p>

                        <div className="mt-2">
                            <Link to="/registro-empresa" className="btn btn-primary">
                                Registrar empresa
                            </Link>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3 className="card-title">Oferentes</h3>
                        <p className="card-text">
                            Registre sus datos, habilidades, niveles de dominio y currículo en formato PDF.
                        </p>

                        <div className="mt-2">
                            <Link to="/registro-oferente" className="btn btn-primary">
                                Registrar oferente
                            </Link>
                        </div>
                    </div>

                    <div className="info-card">
                        <h3 className="card-title">Puestos públicos</h3>
                        <p className="card-text">
                            Consulte los puestos disponibles publicados por empresas registradas en el sistema.
                        </p>

                        <div className="mt-2">
                            <Link to="/puestos-publicos" className="btn btn-primary">
                                Consultar puestos
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomePage;