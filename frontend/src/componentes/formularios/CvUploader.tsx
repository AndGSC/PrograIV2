import React, { ChangeEvent, FormEvent } from 'react';

interface CvUploaderProps {
    archivo: File | null;
    onArchivoSeleccionado: (archivo: File | null) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onArchivoValido?: (mensaje: string) => void;
    onArchivoInvalido?: (mensaje: string) => void;
    disabled?: boolean;
    textoBoton?: string;
    textoAyuda?: string;
}

function CvUploader({
                        archivo,
                        onArchivoSeleccionado,
                        onSubmit,
                        onArchivoValido,
                        onArchivoInvalido,
                        disabled = false,
                        textoBoton = 'Subir currículo',
                        textoAyuda = 'Solo se permite subir un archivo en formato PDF.'
                    }: CvUploaderProps) {
    function seleccionarArchivo(event: ChangeEvent<HTMLInputElement>) {
        const archivoSeleccionado = event.target.files && event.target.files[0];

        if (!archivoSeleccionado) {
            onArchivoSeleccionado(null);
            return;
        }

        const esPdfPorTipo = archivoSeleccionado.type === 'application/pdf';
        const esPdfPorNombre = archivoSeleccionado.name.toLowerCase().endsWith('.pdf');

        if (!esPdfPorTipo && !esPdfPorNombre) {
            onArchivoSeleccionado(null);
            event.target.value = '';

            if (onArchivoInvalido) {
                onArchivoInvalido('Solo se permite subir archivos en formato PDF.');
            }

            return;
        }

        onArchivoSeleccionado(archivoSeleccionado);

        if (onArchivoValido) {
            onArchivoValido(`Archivo seleccionado: ${archivoSeleccionado.name}`);
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="cv">Archivo PDF</label>
                <input
                    id="cv"
                    type="file"
                    accept="application/pdf"
                    onChange={seleccionarArchivo}
                    disabled={disabled}
                />

                <p className="file-help">
                    {textoAyuda}
                </p>
            </div>

            {archivo && (
                <div className="profile-line">
                    <strong>Archivo seleccionado:</strong> {archivo.name}
                </div>
            )}

            <div className="form-actions mt-2">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={disabled}
                >
                    {textoBoton}
                </button>
            </div>
        </form>
    );
}

export default CvUploader;