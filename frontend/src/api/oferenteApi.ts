import { httpGet, httpPost, httpDelete, httpUpload } from './http';

import {
    API_BASE_URL,
    ENDPOINT_OFERENTE_PERFIL,
    ENDPOINT_OFERENTE_HABILIDADES,
    ENDPOINT_OFERENTE_CARACTERISTICAS,
    ENDPOINT_OFERENTE_CV,
    ENDPOINT_OFERENTE_CV_ARCHIVO
} from '../utils/constants';

import type {
    PerfilOferente,
    CvResponse
} from '../tipos/oferente';

import type {
    Habilidad,
    AgregarHabilidadRequest,
    Caracteristica
} from '../tipos/caracteristica';

function obtenerBaseUrlNormalizada() {
    return API_BASE_URL.endsWith('/')
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;
}

export function obtenerPerfilOferente() {
    return httpGet<PerfilOferente>(
        ENDPOINT_OFERENTE_PERFIL
    );
}

export function obtenerCaracteristicasOferente() {
    return httpGet<Caracteristica[]>(
        ENDPOINT_OFERENTE_CARACTERISTICAS
    );
}

export function obtenerMisHabilidades() {
    return httpGet<Habilidad[]>(
        ENDPOINT_OFERENTE_HABILIDADES
    );
}

export function agregarHabilidad(datos: AgregarHabilidadRequest) {
    return httpPost<Habilidad>(
        ENDPOINT_OFERENTE_HABILIDADES,
        datos
    );
}

export function eliminarHabilidad(id: number | string) {
    return httpDelete<void>(
        `${ENDPOINT_OFERENTE_HABILIDADES}/${id}`
    );
}

export function obtenerInfoCv() {
    return httpGet<CvResponse>(
        ENDPOINT_OFERENTE_CV
    );
}

export function subirCv(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return httpUpload<CvResponse>(
        ENDPOINT_OFERENTE_CV,
        formData
    );
}

export function obtenerUrlCv() {
    const baseUrlNormalizada = obtenerBaseUrlNormalizada();

    return `${baseUrlNormalizada}${ENDPOINT_OFERENTE_CV_ARCHIVO}`;
}