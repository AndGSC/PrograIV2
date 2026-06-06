import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import EmptyState from '../../componentes/comunes/EmptyState';
import Loading from '../../componentes/comunes/Loading';
import CandidatoCard from '../../componentes/candidatos/CandidatoCard';

import { buscarCandidatos as buscarCandidatosApi } from '../../api/empresaApi';
import { ApiError } from '../../api/http';

import type { Candidato } from '../../tipos/candidato';

function BuscarCandidatosPage() {
    const [searchParams] = useSearchParams();

    const puestoIdParam = searchParams.get('puestoId');
    const puestoId = puestoIdParam ? Number(puestoIdParam) : undefined;

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(false);
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);

    useEffect(() => {
        if (!puestoId) return;

        async function cargarCandidatos() {
            setCargando(true);
            setMensaje('');

            try {
                const resultados = await buscarCandidatosApi({ puestoId });
                setCandidatos(resultados || []);
            } catch (error) {
                setCandidatos([]);
                setTipoMensaje('danger');
                setMensaje(error instanceof ApiError ? error.message : 'No se pudo realizar la búsqueda.');
            } finally {
                setCargando(false);
            }
        }

        cargarCandidatos();
    }, [puestoId]);

    if (!puestoId) {
        return <Navigate to="/empresa/puestos" replace />;
    }

    return (
        <>
            <PageHeader
                titulo="Candidatos para el puesto"
                subtitulo="Oferentes ordenados por porcentaje de coincidencia"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Buscando candidatos..." />
            ) : (
                <section className="section-block">
                    <div className="search-results-header">
                        <h2 className="section-title mb-0">Resultados</h2>
                        <span className="text-muted">{candidatos.length} candidatos encontrados</span>
                    </div>

                    {candidatos.length === 0 ? (
                        <EmptyState mensaje="No se encontraron candidatos para este puesto." />
                    ) : (
                        <div className="company-grid">
                            {candidatos.map((candidato) => (
                                <CandidatoCard
                                    key={candidato.id}
                                    candidato={candidato}
                                />
                            ))}
                        </div>
                    )}
                </section>
            )}
        </>
    );
}

export default BuscarCandidatosPage;
