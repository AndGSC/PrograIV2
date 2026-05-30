export interface RegistroOferenteRequest {
    identificacion: string;
    nombre: string;
    primerApellido: string;
    nacionalidad: string;
    telefono: string;
    correo: string;
    residencia: string;
    clave: string;
}

export interface OferentePendiente {
    id: number;
    identificacion: string;
    nombre: string;
    primerApellido: string;
    nacionalidad: string;
    telefono: string;
    correo: string;
    residencia: string;
}

export interface PerfilOferente {
    identificacion: string;
    nombre: string;
    primerApellido: string;
    nacionalidad: string;
    telefono: string;
    correo: string;
    residencia: string;
    estado: string;
    cvDisponible: boolean;
}

export interface CvResponse {
    nombreArchivo: string;
    url?: string;
}