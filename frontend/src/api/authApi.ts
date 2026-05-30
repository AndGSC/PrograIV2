import { httpPost, httpGet } from './http';
import { ENDPOINT_LOGIN } from '../utils/constants';

export interface LoginRequest {
    correo: string;
    clave: string;
}

export interface LoginResponse {
    token: string;
    rol: string;
    correo: string;
}

export interface UsuarioActual {
    correo: string;
    rol: string;
    nombre?: string;
}

export function login(datos: LoginRequest) {
    return httpPost<LoginResponse>(ENDPOINT_LOGIN, datos, false);
}

export function obtenerUsuarioActual() {
    return httpGet<UsuarioActual>('/api/auth/me');
}