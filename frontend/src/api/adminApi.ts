import { httpGet, httpPost, httpPatch } from './http';
import {
    ENDPOINT_ADMIN_EMPRESAS_PENDIENTES,
    ENDPOINT_ADMIN_OFERENTES_PENDIENTES,
    ENDPOINT_ADMIN_CARACTERISTICAS
} from '../utils/constants';

export interface EmpresaPendiente {
    id: number;
    nombre: string;
    localizacion: string;
    correo: string;
    telefono: string;
    descripcion: string;
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

export interface Caracteristica {
    id: number;
    nombre: string;
    categoria: string;
    descripcion?: string;
    estado: string;
}

export interface CrearCaracteristicaRequest {
    nombre: string;
    categoria: string;
    descripcion?: string;
}

export interface ReporteAdmin {
    empresasAprobadas: number;
    oferentesAprobados: number;
    puestosPublicos: number;
    empresasPendientes: number;
    oferentesPendientes: number;
    caracteristicasActivas: number;
    caracteristicasInactivas: number;
}

export function obtenerEmpresasPendientes() {
    return httpGet<EmpresaPendiente[]>(ENDPOINT_ADMIN_EMPRESAS_PENDIENTES);
}

export function aprobarEmpresa(id: number) {
    return httpPost<void>(`${ENDPOINT_ADMIN_EMPRESAS_PENDIENTES}/${id}/aprobar`);
}

export function rechazarEmpresa(id: number) {
    return httpPost<void>(`${ENDPOINT_ADMIN_EMPRESAS_PENDIENTES}/${id}/rechazar`);
}

export function obtenerOferentesPendientes() {
    return httpGet<OferentePendiente[]>(ENDPOINT_ADMIN_OFERENTES_PENDIENTES);
}

export function aprobarOferente(id: number) {
    return httpPost<void>(`${ENDPOINT_ADMIN_OFERENTES_PENDIENTES}/${id}/aprobar`);
}

export function rechazarOferente(id: number) {
    return httpPost<void>(`${ENDPOINT_ADMIN_OFERENTES_PENDIENTES}/${id}/rechazar`);
}

export function obtenerCaracteristicas() {
    return httpGet<Caracteristica[]>(ENDPOINT_ADMIN_CARACTERISTICAS);
}

export function crearCaracteristica(datos: CrearCaracteristicaRequest) {
    return httpPost<Caracteristica>(ENDPOINT_ADMIN_CARACTERISTICAS, datos);
}

export function desactivarCaracteristica(id: number) {
    return httpPatch<void>(`${ENDPOINT_ADMIN_CARACTERISTICAS}/${id}/desactivar`);
}

export function obtenerReportesAdmin() {
    return httpGet<ReporteAdmin>('/api/admin/reportes');
}