import { httpGet, httpPost, httpDelete, httpUpload } from './http';
import {
    ENDPOINT_OFERENTE_HABILIDADES,
    ENDPOINT_OFERENTE_CV
} from '../utils/constants';

export interface Habilidad {
    id: number;
    caracteristica: string;
    nivel: string;
}

export interface AgregarHabilidadRequest {
    caracteristica: string;
    nivel: string;
}

export interface CvResponse {
    nombreArchivo: string;
    url?: string;
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

export function obtenerPerfilOferente() {
    return httpGet<PerfilOferente>('/api/oferente/perfil');
}

export function obtenerMisHabilidades() {
    return httpGet<Habilidad[]>(ENDPOINT_OFERENTE_HABILIDADES);
}

export function agregarHabilidad(datos: AgregarHabilidadRequest) {
    return httpPost<Habilidad>(ENDPOINT_OFERENTE_HABILIDADES, datos);
}

export function eliminarHabilidad(id: number) {
    return httpDelete<void>(`${ENDPOINT_OFERENTE_HABILIDADES}/${id}`);
}

export function obtenerInfoCv() {
    return httpGet<CvResponse>(ENDPOINT_OFERENTE_CV);
}

export function subirCv(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return httpUpload<CvResponse>(ENDPOINT_OFERENTE_CV, formData);
}

export function obtenerUrlCv() {
    return ENDPOINT_OFERENTE_CV;
}