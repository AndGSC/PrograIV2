import { httpGet, httpPost, httpDelete, httpUpload } from './http';

import {
    API_BASE_URL,
    ENDPOINT_OFERENTE_HABILIDADES,
    ENDPOINT_OFERENTE_CV
} from '../utils/constants';

import type {
    PerfilOferente,
    CvResponse
} from '../tipos/oferente';

import type {
    Habilidad,
    AgregarHabilidadRequest
} from '../tipos/caracteristica';

export function obtenerPerfilOferente() {
    return httpGet<PerfilOferente>('/api/oferente/perfil');
}

export function obtenerMisHabilidades() {
    return httpGet<Habilidad[]>(ENDPOINT_OFERENTE_HABILIDADES);
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
    return httpGet<CvResponse>(ENDPOINT_OFERENTE_CV);
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
    const baseUrlNormalizada = API_BASE_URL.endsWith('/')
        ? API_BASE_URL.slice(0, -1)
        : API_BASE_URL;

    return `${baseUrlNormalizada}${ENDPOINT_OFERENTE_CV}`;
}