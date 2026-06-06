import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import {
    obtenerPerfilOferente,
    obtenerMisHabilidades,
    obtenerInfoCv
} from '../../api/oferenteApi';

import { ApiError } from '../../api/http';

import type { PerfilOferente } from '../../tipos/oferente';

function obtenerTextoEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (estadoNormalizado === 'ACTIVO') {
        return 'Activo';
    }

    if (estadoNormalizado === 'PENDIENTE') {
        return 'Pendiente';
    }

    if (estadoNormalizado === 'INACTIVO') {
        return 'Inactivo';
    }

    return estado;
}

function DashboardOferentePage() {
    const [perfil, setPerfil] = useState<PerfilOferente | null>(null);
    const [cantidadHabilidades, setCantidadHabilidades] = useState(0);
    const [cvDisponible, setCvDisponible] = useState(false);

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        async function cargarDashboard() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const [datosPerfil, habilidades, cv] = await Promise.all([
                    obtenerPerfilOferente(),
                    obtenerMisHabilidades(),
                    obtenerInfoCv()
                ]);

                setPerfil(datosPerfil);
                setCantidadHabilidades(habilidades ? habilidades.length : 0);
                setCvDisponible(Boolean(cv && cv.nombreArchivo));
            } catch (error) {
                setPerfil(null);
                setCantidadHabilidades(0);
                setCvDisponible(false);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudo cargar la información del dashboard.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarDashboard();
    }, []);

    return (
        <>
            <PageHeader
                titulo="Dashboard oferente"
                subtitulo="Panel principal para gestionar habilidades y currículo"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando información del oferente..." />
            ) : (
                <>
                    <section className="dashboard-grid">
                        <div className="stat-card">
                            <h3>Habilidades registradas</h3>
                            <p>{cantidadHabilidades}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Currículo</h3>
                            <p>{cvDisponible ? '1' : '0'}</p>
                        </div>

                        <div className="stat-card">
                            <h3>Estado del perfil</h3>
                            <p>{perfil ? obtenerTextoEstado(perfil.estado) : 'No disponible'}</p>
                        </div>
                    </section>

                    {perfil && (
                        <section className="section-block">
                            <div className="content-card">
                                <h2 className="section-title">Información del perfil</h2>

                                <div className="profile-grid">
                                    <div className="profile-line">
                                        <strong>Nombre:</strong> {perfil.nombre} {perfil.primerApellido}
                                    </div>

                                    <div className="profile-line">
                                        <strong>Identificación:</strong> {perfil.identificacion}
                                    </div>

                                    <div className="profile-line">
                                        <strong>Correo:</strong> {perfil.correo}
                                    </div>

                                    <div className="profile-line">
                                        <strong>Teléfono:</strong> {perfil.telefono}
                                    </div>

                                    <div className="profile-line">
                                        <strong>Nacionalidad:</strong> {perfil.nacionalidad}
                                    </div>

                                    <div className="profile-line">
                                        <strong>Residencia:</strong> {perfil.residencia}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="section-block mt-3">
                        <div className="content-card">
                            <h2 className="section-title">Acciones rápidas</h2>

                            <div className="quick-links">
                                <Link to="/oferente/habilidades" className="btn btn-primary">
                                    Gestionar habilidades
                                </Link>

                                <Link to="/oferente/cv" className="btn btn-secondary">
                                    Subir currículo
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="section-block">
                        <div className="grid-2-equal">
                            <div className="info-card">
                                <h3 className="card-title">Habilidades</h3>
                                <p className="card-text">
                                    Registre sus características, destrezas y niveles de dominio para que las empresas
                                    puedan encontrar su perfil.
                                </p>
                            </div>

                            <div className="info-card">
                                <h3 className="card-title">Currículo PDF</h3>
                                <p className="card-text">
                                    Mantenga actualizado su currículo en formato PDF para que las empresas puedan
                                    consultarlo al revisar su perfil.
                                </p>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </>
    );
}

export default DashboardOferentePage;