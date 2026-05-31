import React from 'react';

type TipoMensaje = 'success' | 'info' | 'danger' | 'warning';

interface MessageBoxProps {
    tipo: TipoMensaje;
    mensaje: string;
}

function MessageBox({ tipo, mensaje }: MessageBoxProps) {
    if (!mensaje) {
        return null;
    }

    const rolMensaje = tipo === 'danger' || tipo === 'warning'
        ? 'alert'
        : 'status';

    return (
        <div className="messages-container">
            <div
                className={`alert alert-${tipo}`}
                role={rolMensaje}
                aria-live="polite"
            >
                {mensaje}
            </div>
        </div>
    );
}

export default MessageBox;