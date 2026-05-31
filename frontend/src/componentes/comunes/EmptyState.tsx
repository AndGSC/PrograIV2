import React from 'react';

interface EmptyStateProps {
    titulo?: string;
    mensaje: string;
    textoBoton?: string;
    onAccion?: () => void;
}

function EmptyState({ titulo, mensaje, textoBoton, onAccion }: EmptyStateProps) {
    return (
        <div className="empty-state">
            {titulo && <h3>{titulo}</h3>}

            <p>{mensaje}</p>

            {textoBoton && onAccion && (
                <div className="mt-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onAccion}
                    >
                        {textoBoton}
                    </button>
                </div>
            )}
        </div>
    );
}

export default EmptyState;