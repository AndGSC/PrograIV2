import React, { FormEvent, useEffect, useState } from 'react';

import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';
import Loading from '../../componentes/comunes/Loading';
import CvUploader from '../../componentes/formularios/CvUploader';

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
    const [cvUploaderKey, setCvUploaderKey] = useState(0);

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
            setCvUploaderKey((valorActual) => valorActual + 1);

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

    function manejarArchivoValido(mensajeArchivo: string) {
        setTipoMensaje('info');
        setMensaje(mensajeArchivo);
    }

    function manejarArchivoInvalido(mensajeArchivo: string) {
        setTipoMensaje('danger');
        setMensaje(mensajeArchivo);
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

                        <CvUploader
                            key={cvUploaderKey}
                            archivo={archivo}
                            onArchivoSeleccionado={setArchivo}
                            onSubmit={subirCurriculo}
                            onArchivoValido={manejarArchivoValido}
                            onArchivoInvalido={manejarArchivoInvalido}
                            disabled={subiendo}
                            textoBoton={subiendo ? 'Subiendo...' : 'Subir currículo'}
                        />

                        {subiendo && (
                            <Loading mensaje="Subiendo currículo..." />
                        )}
                    </div>
                </section>
            )}
        </>
    );
}

export default MiCvPage;