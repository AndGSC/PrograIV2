import React from 'react';

interface PageHeaderProps {
    titulo: string;
    subtitulo?: string;
}

function PageHeader({ titulo, subtitulo }: PageHeaderProps) {
    return (
        <div className="page-header">
            <h1 className="page-title">{titulo}</h1>

            {subtitulo && (
                <p className="page-subtitle">{subtitulo}</p>
            )}
        </div>
    );
}

export default PageHeader;