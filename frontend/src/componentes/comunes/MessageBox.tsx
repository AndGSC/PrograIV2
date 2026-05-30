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

    return (
        <div className="messages-container">
            <div className={`alert alert-${tipo}`}>
                {mensaje}
            </div>
        </div>
    );
}

export default MessageBox;