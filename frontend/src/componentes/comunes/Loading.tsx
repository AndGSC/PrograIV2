import React from 'react';

interface LoadingProps {
    mensaje?: string;
}

function Loading({ mensaje = 'Cargando información...' }: LoadingProps) {
    return (
        <div className="loading-state">
            <p>{mensaje}</p>
        </div>
    );
}

export default Loading;