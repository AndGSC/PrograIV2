import { httpGet, httpPost } from './http';
import type { ParametrosUrl } from './http';

import {
    ENDPOINT_REGISTRO_EMPRESA,
    ENDPOINT_REGISTRO_OFERENTE,
    ENDPOINT_PUESTOS_PUBLICOS,
    ENDPOINT_BUSCAR_PUESTOS
} from '../utils/constants';

export interface RegistroEmpresaRequest {
    nombre: string;
    localizacion: string;
    correo: string;
    telefono: string;
    descripcion: string;
    clave: string;
}

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

export interface PuestoPublico {
    id: number;
    empresa: string;
    puesto: string;
    salario: string;
    tipo: string;
    descripcion?: string;
    caracteristicas?: string[];
}

export interface BuscarPuestosParams extends ParametrosUrl {
    textoBusqueda?: string;
    nivel?: string;
}

export function registrarEmpresa(datos: RegistroEmpresaRequest) {
    return httpPost<void>(ENDPOINT_REGISTRO_EMPRESA, datos, false);
}

export function registrarOferente(datos: RegistroOferenteRequest) {
    return httpPost<void>(ENDPOINT_REGISTRO_OFERENTE, datos, false);
}

export function obtenerPuestosPublicos() {
    return httpGet<PuestoPublico[]>(
        ENDPOINT_PUESTOS_PUBLICOS,
        undefined,
        false
    );
}

export function buscarPuestos(params: BuscarPuestosParams) {
    return httpGet<PuestoPublico[]>(
        ENDPOINT_BUSCAR_PUESTOS,
        params,
        false
    );
}

export function obtenerDetallePuesto(id: number | string) {
    return httpGet<PuestoPublico>(
        `${ENDPOINT_PUESTOS_PUBLICOS}/${id}`,
        undefined,
        false
    );
}