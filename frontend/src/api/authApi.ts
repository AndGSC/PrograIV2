import { httpPost, httpGet } from './http';

import {
    ENDPOINT_LOGIN,
    ENDPOINT_USUARIO_ACTUAL
} from '../utils/constants';

import type {
    LoginRequest,
    LoginResponse,
    UsuarioActual
} from '../tipos/auth';

export function login(datos: LoginRequest) {
    return httpPost<LoginResponse>(
        ENDPOINT_LOGIN,
        datos,
        false
    );
}

export function obtenerUsuarioActual() {
    return httpGet<UsuarioActual>(
        ENDPOINT_USUARIO_ACTUAL
    );
}