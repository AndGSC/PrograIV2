import { httpGet, httpPost, httpPatch } from './http';
import type { ParametrosUrl } from './http';

import {
    API_BASE_URL,
    ENDPOINT_EMPRESA_PUESTOS,
    ENDPOINT_EMPRESA_CANDIDATOS
} from '../utils/constants';

import type {
    PuestoEmpresa,
    PublicarPuestoRequest
} from '../tipos/puesto';

import type { Candidato } from '../tipos/candidato';

export interface BuscarCandidatosParams extends ParametrosUrl {
    palabraClave?: string;
    nivel?: string;
    puestoId?: number;
}

function obtenerBaseUrlNormalizada() {
    return API_BASE_URL.endsWith('/')
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
}

export function obtenerMisPuestos() {
    return httpGet<PuestoEmpresa[]>(
        ENDPOINT_EMPRESA_PUESTOS
    );
}

export function publicarPuesto(datos: PublicarPuestoRequest) {
    return httpPost<PuestoEmpresa>(
        ENDPOINT_EMPRESA_PUESTOS,
        datos
    );
}

export function obtenerDetallePuestoEmpresa(id: number | string) {
    return httpGet<PuestoEmpresa>(
        `${ENDPOINT_EMPRESA_PUESTOS}/${id}`
    );
}

export function desactivarPuesto(id: number | string) {
    return httpPatch<void>(
        `${ENDPOINT_EMPRESA_PUESTOS}/${id}/desactivar`
    );
}

export function buscarCandidatos(params: BuscarCandidatosParams) {
    return httpGet<Candidato[]>(
        ENDPOINT_EMPRESA_CANDIDATOS,
        params
    );
}

export function obtenerDetalleCandidato(id: number | string) {
    return httpGet<Candidato>(
        `${ENDPOINT_EMPRESA_CANDIDATOS}/${id}`
    );
}

export function obtenerUrlCurriculoCandidato(id: number | string) {
    const baseUrlNormalizada = obtenerBaseUrlNormalizada();

    return `${baseUrlNormalizada}${ENDPOINT_EMPRESA_CANDIDATOS}/${id}/cv`;
}