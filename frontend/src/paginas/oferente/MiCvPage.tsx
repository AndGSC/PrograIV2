import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';

import {
    obtenerInfoCv,
    subirCv,
    obtenerUrlCv
} from '../../api/oferenteApi';

import { ApiError } from '../../api/http';

function MiCvPage() {
    const [archivo, setArchivo] = useState<File | null>(null);
    const [nombreArchivoActual, setNombreArchivoActual] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState<'success' | 'info' | 'danger' | 'warning'>('info');
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);

    useEffect(() => {
        async function cargarInfoCv() {
            setMensaje('');
            setTipoMensaje('info');
            setCargando(true);

            try {
                const datos = await obtenerInfoCv();

                if (datos && datos.nombreArchivo) {
                    setNombreArchivoActual(datos.nombreArchivo);
                } else {
                    setNombreArchivoActual('');
                }
            } catch (error) {
                setNombreArchivoActual('');
                setTipoMensaje('danger');

                if (error instanceof ApiError) {
                    setMensaje(error.message);
                } else {
                    setMensaje('No se pudo cargar la información del currículo.');
                }
            } finally {
                setCargando(false);
            }
        }

        cargarInfoCv();
    }, []);

    function seleccionarArchivo(event: ChangeEvent<HTMLInputElement>) {
        const archivoSeleccionado = event.target.files && event.target.files[0];

        if (!archivoSeleccionado) {
            setArchivo(null);
            return;
        }

        if (archivoSeleccionado.type !== 'application/pdf') {
            setArchivo(null);
            setTipoMensaje('danger');
            setMensaje('Solo se permite subir archivos en formato PDF.');
            event.target.value = '';
            return;
        }

        setArchivo(archivoSeleccionado);
        setTipoMensaje('info');
        setMensaje(`Archivo seleccionado: ${archivoSeleccionado.name}`);
    }

    async function subirCurriculo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!archivo) {
            setTipoMensaje('warning');
            setMensaje('Debe seleccionar un archivo PDF antes de subirlo.');
            return;
        }

        setMensaje('');
        setTipoMensaje('info');
        setSubiendo(true);

        try {
            const respuesta = await subirCv(archivo);

            setNombreArchivoActual(respuesta.nombreArchivo || archivo.name);
            setArchivo(null);
            setTipoMensaje('success');
            setMensaje('Currículo actualizado correctamente.');
        } catch (error) {
            setTipoMensaje('danger');

            if (error instanceof ApiError) {
                setMensaje(error.message);
            } else {
                setMensaje('No se pudo subir el currículo.');
            }
        } finally {
            setSubiendo(false);
        }
    }

    function verCurriculo() {
        if (!nombreArchivoActual) {
            return;
        }

        const urlCv = obtenerUrlCv();

        window.open(
            urlCv,
            '_blank',
            'noopener,noreferrer'
        );
    }

    return (
        <>
            <PageHeader
                titulo="Mi currículo"
                subtitulo="Suba o actualice su currículo en formato PDF"
            />

            <MessageBox tipo={tipoMensaje} mensaje={mensaje} />

            {cargando ? (
                <Loading mensaje="Cargando información del currículo..." />
            ) : (
                <section className="grid-2">
                    <div className="cv-box">
                        <h2 className="section-title">Currículo actual</h2>

                        {nombreArchivoActual ? (
                            <>
                                <p className="cv-status">
                                    Archivo registrado: <strong>{nombreArchivoActual}</strong>
                                </p>

                                <div className="actions-row">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={verCurriculo}
                                        disabled={subiendo}
                                    >
                                        Ver currículo
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="cv-status">
                                No tiene un currículo registrado actualmente.
                            </p>
                        )}
                    </div>

                    <div className="form-card">
                        <h2 className="section-title">Actualizar currículo</h2>

                        <form onSubmit={subirCurriculo}>
                            <div className="form-group">
                                <label htmlFor="cv">Archivo PDF</label>
                                <input
                                    id="cv"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={seleccionarArchivo}
                                    disabled={subiendo}
                                />

                                <p className="file-help">
                                    Solo se permite subir un archivo en formato PDF.
                                </p>
                            </div>

                            {archivo && (
                                <div className="profile-line">
                                    <strong>Archivo seleccionado:</strong> {archivo.name}
                                </div>
                            )}

                            {subiendo && (
                                <Loading mensaje="Subiendo currículo..." />
                            )}

                            <div className="form-actions mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={subiendo}
                                >
                                    {subiendo ? 'Subiendo...' : 'Subir currículo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
}

export default MiCvPage;