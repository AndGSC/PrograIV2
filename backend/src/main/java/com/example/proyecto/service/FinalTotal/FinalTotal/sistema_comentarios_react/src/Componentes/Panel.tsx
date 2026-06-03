import React, {useState} from 'react';
import PanelIzquierdo from "./PanelIzquierdo";
import PanelDerecho from "./PanelDerecho";

function Panel() {

    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [codigo, setCodigo] = useState(0);
    function seleccionar(codigo:number, cedula:string, nombre:string){
        setCedula(cedula);
        setNombre(nombre);
        setCodigo(codigo);
    }

    return (
        <div className="row">
            <PanelIzquierdo codigo={codigo} marcar={seleccionar} titulo={"Contactos"}></PanelIzquierdo>
            <PanelDerecho codigo={codigo} cedula={cedula} nombre={nombre}></PanelDerecho>
        </div>
    );
}

export default Panel;
