import { httpGet, httpPost, httpPatch } from './http';
import type { ParametrosUrl } from './http';

import {
    API_BASE_URL,
    ENDPOINT_EMPRESA_PUESTOS,
    ENDPOINT_EMPRESA_CANDIDATOS
} from '../utils/constants';

export interface PuestoEmpresa {
    id: number;
    titulo: string;
    descripcion: string;
    salario: string;
    tipoPublicacion: string;
    estado: string;
}

export interface RequisitoPuesto {
    caracteristica: string;
    nivel: string;
}

export interface PublicarPuestoRequest {
    titulo: string;
    descripcion: string;
    salario: string;
    tipoPublicacion: string;
    requisitos: RequisitoPuesto[];
}

export interface BuscarCandidatosParams extends ParametrosUrl {
    palabraClave?: string;
    nivel?: string;
    puestoId?: number;
}

export interface Candidato {
    id: number;
    identificacion?: string;
    nombre: string;
    nacionalidad?: string;
    telefono: string;
    correo: string;
    residencia: string;
    coincidencia: number;
    cvDisponible?: boolean;
    habilidades: string[];
}

export function obtenerMisPuestos() {
    return httpGet<PuestoEmpresa[]>(ENDPOINT_EMPRESA_PUESTOS);
}

export function publicarPuesto(datos: PublicarPuestoRequest) {
    return httpPost<PuestoEmpresa>(ENDPOINT_EMPRESA_PUESTOS, datos);
}

export function obtenerDetallePuestoEmpresa(id: number) {
    return httpGet<PuestoEmpresa>(`${ENDPOINT_EMPRESA_PUESTOS}/${id}`);
}

export function desactivarPuesto(id: number) {
    return httpPatch<void>(`${ENDPOINT_EMPRESA_PUESTOS}/${id}/desactivar`);
}

export function buscarCandidatos(params: BuscarCandidatosParams) {
    return httpGet<Candidato[]>(ENDPOINT_EMPRESA_CANDIDATOS, params);
}

export function obtenerDetalleCandidato(id: number | string) {
    return httpGet<Candidato>(`${ENDPOINT_EMPRESA_CANDIDATOS}/${id}`);
}

export function obtenerUrlCurriculoCandidato(id: number | string) {
    const baseUrlNormalizada = API_BASE_URL.endsWith('/')
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

    return `${baseUrlNormalizada}${ENDPOINT_EMPRESA_CANDIDATOS}/${id}/cv`;
}