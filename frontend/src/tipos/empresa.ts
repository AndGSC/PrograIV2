export interface RegistroEmpresaRequest {
    nombre: string;
    localizacion: string;
    correo: string;
    telefono: string;
    descripcion: string;
    clave: string;
}

export interface EmpresaPendiente {
    id: number;
    nombre: string;
    localizacion: string;
    correo: string;
    telefono: string;
    descripcion: string;
}

export interface EmpresaResumen {
    id: number;
    nombre: string;
    correo: string;
    telefono?: string;
    localizacion?: string;
}