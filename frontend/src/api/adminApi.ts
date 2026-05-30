import { httpGet, httpPost, httpPatch } from './http';

import {
    ENDPOINT_ADMIN_EMPRESAS_PENDIENTES,
    ENDPOINT_ADMIN_OFERENTES_PENDIENTES,
    ENDPOINT_ADMIN_CARACTERISTICAS
} from '../utils/constants';

import type { EmpresaPendiente } from '../tipos/empresa';
import type { OferentePendiente } from '../tipos/oferente';
import type {
    Caracteristica,
    CrearCaracteristicaRequest
} from '../tipos/caracteristica';
import type { ReporteAdmin } from '../tipos/api';

export function obtenerEmpresasPendientes() {
    return httpGet<EmpresaPendiente[]>(ENDPOINT_ADMIN_EMPRESAS_PENDIENTES);
}

export function aprobarEmpresa(id: number | string) {
    return httpPost<void>(
        `${ENDPOINT_ADMIN_EMPRESAS_PENDIENTES}/${id}/aprobar`
    );
}

export function rechazarEmpresa(id: number | string) {
    return httpPost<void>(
        `${ENDPOINT_ADMIN_EMPRESAS_PENDIENTES}/${id}/rechazar`
    );
}

export function obtenerOferentesPendientes() {
    return httpGet<OferentePendiente[]>(ENDPOINT_ADMIN_OFERENTES_PENDIENTES);
}

export function aprobarOferente(id: number | string) {
    return httpPost<void>(
        `${ENDPOINT_ADMIN_OFERENTES_PENDIENTES}/${id}/aprobar`
    );
}

export function rechazarOferente(id: number | string) {
    return httpPost<void>(
        `${ENDPOINT_ADMIN_OFERENTES_PENDIENTES}/${id}/rechazar`
    );
}

export function obtenerCaracteristicas() {
    return httpGet<Caracteristica[]>(ENDPOINT_ADMIN_CARACTERISTICAS);
}

export function crearCaracteristica(datos: CrearCaracteristicaRequest) {
    return httpPost<Caracteristica>(
        ENDPOINT_ADMIN_CARACTERISTICAS,
        datos
    );
}

export function desactivarCaracteristica(id: number | string) {
    return httpPatch<void>(
        `${ENDPOINT_ADMIN_CARACTERISTICAS}/${id}/desactivar`
    );
}

export function obtenerReportesAdmin() {
    return httpGet<ReporteAdmin>('/api/admin/reportes');
}