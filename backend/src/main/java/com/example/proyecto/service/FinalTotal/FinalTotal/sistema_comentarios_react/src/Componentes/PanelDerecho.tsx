import React, {useEffect, useState} from 'react';

interface PanelDerechoProps {
    cedula:string;
    nombre:string,
    codigo:number
}

interface Comentario{
    Codigo:number;
    Comentario:string,
    Fecha:string
}

function PanelDerecho({codigo, cedula, nombre}:PanelDerechoProps) {
    const [comentarios, setComentarios] = useState([]);
    // variables de formulario
    const [comentarioActual, setComentarioActual] = useState("");

    async function fetchComentarios(){
        var response = await fetch("https://it-experts-latam.com/UNA/ListarComentarios?codigo=" + codigo);
        if(response.ok){
            setComentarios(await response.json());
        }
    }
    useEffect(() => {
        fetchComentarios();
    }, [codigo]);
    // Si es la primera vez que ingresa
    // el código está en 0, entonces se carga con el API llamando Codigo=0
    // Como eso regresa [] es necesario decirle al efecto que se invoque
    // cada vez que el "codigo" cambie de estado.
    // En el panel izquierdo no era necesario porque el trigger nunca cambia.


    /////////////////////////////////////////////////////////////
    function agregarComentario(){
        fetch("https://it-experts-latam.com/UNA/AgregarComentario", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                usuario: codigo,
                comentario: comentarioActual,
            })
        }).then((resultado:Response)=> {
            fetchComentarios();
            setComentarioActual("");
        });
    }
    /////////////////////////////////////////////////////////////
    if(codigo === 0){
        return (
            <div style={{padding:"20px"}} className="col-md-8">
                <p>Por favor selecione un contacto primero</p>
            </div>
        );
    }
    else{
        return (
            <div style={{padding:"20px"}} className="col-md-8">
                <h4>{nombre}</h4>
                <h5>{cedula}</h5>
                <h5>Lista de comentarios</h5>
                <ul className={"list-group list-group-flush"}>
                    {comentarios.map((item:Comentario)=>
                        <li>{item.Comentario}</li>
                    )}
                </ul>
                <hr/>
                <div className={"mb-3"}>
                    <b>Ingrese su comentario aquí:</b>
                    <textarea onChange={e=> setComentarioActual(e.target.value)}
                              value={comentarioActual} className={"form-control"}
                              rows={3}>
                </textarea>
                    <button onClick={()=> agregarComentario()} className={"btn btn-primary"}>
                        Guardar
                    </button>
                </div>
            </div>
        );
    }
}

export default PanelDerecho;
