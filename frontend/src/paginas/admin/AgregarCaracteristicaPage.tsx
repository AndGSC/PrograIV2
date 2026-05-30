import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../componentes/comunes/PageHeader';
import MessageBox from '../../componentes/comunes/MessageBox';

function AgregarCaracteristicaPage() {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [mensaje, setMensaje] = useState('');

    function guardarCaracteristica(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensaje('Característica registrada correctamente.');

        setNombre('');
        setCategoria('');
        setDescripcion('');
    }

    return (
        <>
            <PageHeader
                titulo="Agregar característica"
                subtitulo="Registre una característica que podrá usarse en puestos y habilidades"
            />

            <MessageBox tipo="success" mensaje={mensaje} />

            <div className="form-wrapper">
                <form className="form-card" onSubmit={guardarCaracteristica}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre de la característica</label>
                        <input
                            id="nombre"
                            type="text"
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)}
                            placeholder="Ejemplo: Java, React, SQL"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoria">Categoría principal</label>
                        <input
                            id="categoria"
                            type="text"
                            value={categoria}
                            onChange={(event) => setCategoria(event.target.value)}
                            placeholder="Ejemplo: Lenguajes de programación"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(event) => setDescripcion(event.target.value)}
                            placeholder="Descripción opcional de la característica"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Guardar característica
                        </button>

                        <Link to="/admin/caracteristicas" className="btn btn-secondary">
                            Volver
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AgregarCaracteristicaPage;