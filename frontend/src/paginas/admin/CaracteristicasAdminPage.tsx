import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PageHeader from '../../componentes/comunes/PageHeader';
import EmptyState from '../../componentes/comunes/EmptyState';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import {
    obtenerCaracteristicas,
    desactivarCaracteristica as desactivarCaracteristicaApi,
    crearCaracteristica
} from '../../api/adminApi';

import { ApiError } from '../../api/http';

import type { Caracteristica } from '../../tipos/caracteristica';

function obtenerTextoEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (
        estadoNormalizado === 'ACTIVA' ||
        estadoNormalizado === 'ACTIVO' ||
        estadoNormalizado === 'A'
    ) {
        return 'Activa';
    }

    if (
        estadoNormalizado === 'INACTIVA' ||
        estadoNormalizado === 'INACTIVO' ||
        estadoNormalizado === 'I'
    ) {
        return 'Inactiva';
    }

    return estado;
}

function obtenerClaseEstado(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    if (
        estadoNormalizado === 'ACTIVA' ||
        estadoNormalizado === 'ACTIVO' ||
        estadoNormalizado === 'A'
    ) {
        return 'badge badge-success';
    }

    return 'badge badge-neutral';
}

function estaInactiva(estado: string) {
    const estadoNormalizado = estado.trim().toUpperCase();

    return (
        estadoNormalizado === 'INACTIVA' ||
        estadoNormalizado === 'INACTIVO' ||
        estadoNormalizado === 'I'
    );
}

function CaracteristicasAdminPage() {
    const [caracteristicas, setCaracteristicas] = useState<Caracteristica[]>([]);
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('success');
    const [cargando, setCargando] = useState(true);
    const [desactivandoId, setDesactivandoId] = useState<number | null>(null);

    useEffect(() => {
        async function cargarCaracteristicas() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerCaracteristicas();
                setCaracteristicas(datos || []);
            } catch (error) {
                setCaracteristicas([]);
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudieron cargar las características.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarCaracteristicas();
    }, []);

    function obtenerCategoriasPrincipales(lista: Caracteristica[]) {

        return lista
            .filter(c => c.categoria && c.categoria.toLowerCase() === 'general')
            .map(c => c.nombre)
            .sort((a, b) => a.localeCompare(b));
    }

    function renderArbolCaracteristicas(lista: Caracteristica[]) {
        const categorias = lista.filter(c => c.categoria && c.categoria.toLowerCase() === 'general')
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
        const hijosPorCategoria: Record<string, Caracteristica[]> = {};

        lista.forEach(c => {
            if (!c.categoria || c.categoria.toLowerCase() === 'general') return;
            if (!hijosPorCategoria[c.categoria]) hijosPorCategoria[c.categoria] = [];
            hijosPorCategoria[c.categoria].push(c);
        });


        Object.keys(hijosPorCategoria).forEach(key => {
            hijosPorCategoria[key].sort((a, b) => a.nombre.localeCompare(b.nombre));
        });

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categorias.map(cat => (
                    <div key={cat.id} style={{ marginBottom: '8px' }}>
                        <div style={{ 
                            fontWeight: 'bold', 
                            fontSize: '15px', 
                            color: '#333',
                            marginBottom: '6px',
                            paddingBottom: '4px',
                            borderBottom: '1px solid #e0e0e0'
                        }}>
                            {cat.nombre} <span style={{ color: '#666', fontSize: '13px' }}>(ID: {cat.id})</span>
                        </div>
                        <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {(hijosPorCategoria[cat.nombre] || []).length === 0 ? (
                                <div style={{ color: '#999', fontSize: '13px', fontStyle: 'italic' }}>
                                    Sin subcategorías
                                </div>
                            ) : (
                                (hijosPorCategoria[cat.nombre] || []).map(h => (
                                    <div 
                                        key={h.id} 
                                        style={{ 
                                            color: '#555', 
                                            fontSize: '14px',
                                            padding: '4px 8px',
                                            borderLeft: '2px solid #007bff',
                                            paddingLeft: '10px'
                                        }}
                                    >
                                        {h.nombre} <span style={{ color: '#999', fontSize: '12px' }}>(ID: {h.id})</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    async function guardarCaracteristica() {
        if (!nombre || nombre.trim() === '') {
            setTipoMensaje('danger');
            setMensaje('El nombre es obligatorio.');
            return;
        }

        setGuardando(true);
        setTipoMensaje('info');
        setMensaje('Guardando...');

        try {
            const creada = await crearCaracteristica({ nombre, categoria, descripcion });
            // actualizar lista local
            const actualizadas = [...caracteristicas, creada];
            setCaracteristicas(actualizadas);
            setTipoMensaje('success');
            setMensaje('Característica registrada correctamente.');
            setNombre('');
            setCategoria('');
            setDescripcion('');
        } catch (error) {
            setTipoMensaje('danger');
            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo registrar la característica.');
            }
        } finally {
            setGuardando(false);
        }
    }

    async function desactivarCaracteristica(id: number) {
        setMensaje('');
        setTipoMensaje('info');
        setDesactivandoId(id);

        try {
            await desactivarCaracteristicaApi(id);

            const actualizadas = caracteristicas.map((caracteristica) => {
                if (caracteristica.id === id) {
                    return {
                        ...caracteristica,
                        estado: 'Inactiva'
                    };
                }

                return caracteristica;
            });

            setCaracteristicas(actualizadas);
            setTipoMensaje('success');
            setMensaje('Característica desactivada correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo desactivar la característica.');
            }
        } finally {
            setDesactivandoId(null);
        }
    }

    return (
        <>
            <PageHeader
                titulo="Características"
                subtitulo="Administre las características que se usarán en puestos y habilidades"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            <section className="section-block">
                <div className="two-column">
                    <div className="left-column">
                        <h3>Árbol de características</h3>


                        {cargando ? (
                            <Loading mensaje="Cargando características..." />
                        ) : caracteristicas.length === 0 ? (
                            <EmptyState mensaje="No hay características registradas." />
                        ) : (
                            <div className="tree-list">
                                {renderArbolCaracteristicas(caracteristicas)}
                            </div>
                        )}
                    </div>

                    <div className="right-column">
                        <div className="form-card">
                            <h4>Agregar característica</h4>


                            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

                            <div className="form-group">
                                <label htmlFor="nombre">Nombre</label>
                                <input id="nombre" type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ejemplo: HTML, Java, Base de datos" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="categoria">Característica padre</label>
                                <input id="categoria" list="categoria-list" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Sin padre (principal)" />
                                <datalist id="categoria-list">
                                    {obtenerCategoriasPrincipales(caracteristicas).map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>

                            <div className="form-actions">
                                <button className="btn btn-primary" onClick={guardarCaracteristica} disabled={guardando}>
                                    {guardando ? 'Guardando...' : 'Guardar característica'}
                                </button>
                                <Link to="/admin" className="btn btn-outline-dark">Volver al dashboard</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CaracteristicasAdminPage;