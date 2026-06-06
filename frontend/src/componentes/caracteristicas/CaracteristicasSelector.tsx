import React from 'react';

interface Caracteristica {
    id: number;
    nombre: string;
    categoria: string;
}

interface CaracteristicasSelectorProps {
    caracteristicas?: Caracteristica[];
    cargandoCaracteristicas?: boolean;
    caracteristica: string;
    nivel: string;
    onCaracteristicaChange: (valor: string) => void;
    onNivelChange: (valor: string) => void;
    onAgregar?: () => void;
    disabled?: boolean;
    textoBoton?: string;
    idPrefijo?: string;
    placeholder?: string;
}

function CaracteristicasSelector({
    caracteristicas = [],
    cargandoCaracteristicas = false,
    caracteristica,
    nivel,
    onCaracteristicaChange,
    onNivelChange,
    onAgregar,
    disabled = false,
    textoBoton = 'Agregar',
    idPrefijo = 'caracteristica',
}: CaracteristicasSelectorProps) {
    const idCaracteristica = `${idPrefijo}-nombre`;
    const idNivel = `${idPrefijo}-nivel`;

    const categorias = caracteristicas
        .filter(c => c.categoria && c.categoria.toLowerCase() === 'general')
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

    const hijosPorCategoria: Record<string, Caracteristica[]> = {};
    caracteristicas
        .filter(c => c.categoria && c.categoria.toLowerCase() !== 'general')
        .forEach(c => {
            if (!hijosPorCategoria[c.categoria]) hijosPorCategoria[c.categoria] = [];
            hijosPorCategoria[c.categoria].push(c);
        });

    return (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor={idCaracteristica}>Característica</label>
                    <select
                        id={idCaracteristica}
                        value={caracteristica}
                        onChange={(event) => onCaracteristicaChange(event.target.value)}
                        disabled={disabled || cargandoCaracteristicas}
                    >
                        <option value="">
                            {cargandoCaracteristicas ? 'Cargando...' : 'Seleccione una característica'}
                        </option>
                        {categorias.map(cat => (
                            <optgroup key={cat.id} label={cat.nombre}>
                                <option value={cat.nombre}>{cat.nombre} (general)</option>
                                {(hijosPorCategoria[cat.nombre] || []).sort((a, b) => a.nombre.localeCompare(b.nombre)).map(hijo => (
                                    <option key={hijo.id} value={hijo.nombre}>
                                        {hijo.nombre}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor={idNivel}>Nivel</label>
                    <select
                        id={idNivel}
                        value={nivel}
                        onChange={(event) => onNivelChange(event.target.value)}
                        disabled={disabled}
                    >
                        <option value="">Seleccione</option>
                        <option value="BASICO">Básico</option>
                        <option value="INTERMEDIO">Intermedio</option>
                        <option value="AVANZADO">Avanzado</option>
                    </select>
                </div>
            </div>

            {onAgregar && (
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onAgregar}
                        disabled={disabled}
                    >
                        {textoBoton}
                    </button>
                </div>
            )}
        </>
    );
}

export default CaracteristicasSelector;