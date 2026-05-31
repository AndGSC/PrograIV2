import React from 'react';

interface CaracteristicasSelectorProps {
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
                                     caracteristica,
                                     nivel,
                                     onCaracteristicaChange,
                                     onNivelChange,
                                     onAgregar,
                                     disabled = false,
                                     textoBoton = 'Agregar',
                                     idPrefijo = 'caracteristica',
                                     placeholder = 'Ejemplo: Java, React, SQL'
                                 }: CaracteristicasSelectorProps) {
    const idCaracteristica = `${idPrefijo}-nombre`;
    const idNivel = `${idPrefijo}-nivel`;

    return (
        <>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor={idCaracteristica}>Característica</label>
                    <input
                        id={idCaracteristica}
                        type="text"
                        value={caracteristica}
                        onChange={(event) => onCaracteristicaChange(event.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
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