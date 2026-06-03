import React, {useEffect, useState} from 'react';

interface PanelIzquierdoProp{
    marcar: (codigo:number, cedula:string, nombre:string) => void;
    titulo:string;
    codigo:number;
}

interface Contacto {
    Cedula:string,
    Nombre:string,
    Codigo:number
}

function PanelIzquierdo({titulo, codigo, marcar}:PanelIzquierdoProp) {
    const [personas, setPersonas] = useState([]); // Eso se inicia en [] porque recibe un vector.
    useEffect(() => {
        async function fetchContactos(){

            // 1. se va a cargar el URL + [parametros]
            // 2. se invoca
            // 3. Resultado
            // 4. Obtiene

            const response = await fetch("http://localhost:8080/api/personas",
                {
                    method: "GET",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }),
                }
            );
            if(response.ok){
                setPersonas(await response.json())
            }
            // response.close(); // solo en BD
        }
        fetchContactos();
    }, []);
    /////////////////////////////////////////////////////////////////////////////////////////
    /*
        Si se necesitas usar un cast es necesario ponerlo entre ()
        i.e.
        (persona: Contacto)
     */
    return (
        <div style={{padding:"20px"}} className="col-md-4">
            <h4>{titulo}</h4>
            <ol>
                {personas.map((persona: Contacto) => (
                    <li style={{color:(codigo === persona.Codigo ? "red" :"black")}}
                        onClick={()=> marcar(persona.Codigo, persona.Cedula, persona.Nombre)}
                        key={persona.Codigo}>{persona.Nombre}</li>
                ))}
            </ol>
        </div>
    );
}

export default PanelIzquierdo;
