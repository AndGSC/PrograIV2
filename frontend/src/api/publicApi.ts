import { httpGet, httpPost } from './http';
import type { ParametrosUrl } from './http';

import {
    ENDPOINT_REGISTRO_EMPRESA,
    ENDPOINT_REGISTRO_OFERENTE,
    ENDPOINT_PUESTOS_PUBLICOS,
    ENDPOINT_BUSCAR_PUESTOS,
    ENDPOINT_NACIONALIDADES,
    ENDPOINT_NACIONALIDADES_NOMBRES
} from '../utils/constants';

import type { RegistroEmpresaRequest } from '../tipos/empresa';
import type { RegistroOferenteRequest } from '../tipos/oferente';
import type { PuestoPublico } from '../tipos/puesto';
import type { Nacionalidad } from '../tipos/nacionalidad';

export interface BuscarPuestosParams extends ParametrosUrl {
    textoBusqueda?: string;
    nivel?: string;
}

export function registrarEmpresa(datos: RegistroEmpresaRequest) {
    return httpPost<void>(
        ENDPOINT_REGISTRO_EMPRESA,
        datos,
        false
    );
}

export function registrarOferente(datos: RegistroOferenteRequest) {
    return httpPost<void>(
        ENDPOINT_REGISTRO_OFERENTE,
        datos,
        false
    );
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

export function obtenerNacionalidades() {
    return httpGet<Nacionalidad[]>(
        ENDPOINT_NACIONALIDADES,
        undefined,
        false
    );
}

export function obtenerNombresNacionalidades() {
    return httpGet<string[]>(
        ENDPOINT_NACIONALIDADES_NOMBRES,
        undefined,
        false
    );
}

