import {
    STORAGE_TOKEN_KEY,
    STORAGE_ROL_KEY,
    STORAGE_CORREO_KEY,
    ROLE_ADMIN,
    ROLE_EMPRESA,
    ROLE_OFERENTE,
    RUTA_ADMIN,
    RUTA_EMPRESA,
    RUTA_OFERENTE,
    RUTA_HOME,
    RolUsuario
} from './constants';

export interface SesionUsuario {
    token: string;
    rol: string;
    correo: string;
}

export function guardarToken(token: string) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

export function obtenerToken() {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function eliminarToken() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
}

export function guardarRol(rol: string) {
    localStorage.setItem(STORAGE_ROL_KEY, rol);
}

export function obtenerRol() {
    return localStorage.getItem(STORAGE_ROL_KEY);
}

export function eliminarRol() {
    localStorage.removeItem(STORAGE_ROL_KEY);
}

export function guardarCorreo(correo: string) {
    localStorage.setItem(STORAGE_CORREO_KEY, correo);
}

export function obtenerCorreo() {
    return localStorage.getItem(STORAGE_CORREO_KEY);
}

export function eliminarCorreo() {
    localStorage.removeItem(STORAGE_CORREO_KEY);
}

export function guardarSesion(token: string, rol: string, correo: string) {
    guardarToken(token);
    guardarRol(rol);
    guardarCorreo(correo);
}

export function obtenerSesion(): SesionUsuario | null {
    const token = obtenerToken();
    const rol = obtenerRol();
    const correo = obtenerCorreo();

    if (!token || !rol || !correo) {
        return null;
    }

    return {
        token,
        rol,
        correo
    };
}

export function cerrarSesion() {
    eliminarToken();
    eliminarRol();
    eliminarCorreo();
}

export function estaAutenticado() {
    const token = obtenerToken();
    return token !== null && token.trim() !== '';
}

export function tieneRol(rolesPermitidos: string[]) {
    const rol = obtenerRol();

    if (!rol) {
        return false;
    }

    return rolesPermitidos.includes(rol);
}

export function obtenerRutaPorRol(rol: string) {
    if (rol === ROLE_ADMIN) {
        return RUTA_ADMIN;
    }

    if (rol === ROLE_EMPRESA) {
        return RUTA_EMPRESA;
    }

    if (rol === ROLE_OFERENTE) {
        return RUTA_OFERENTE;
    }

    return RUTA_HOME;
}

export function esRolValido(rol: string) {
    return (
        rol === ROLE_ADMIN ||
        rol === ROLE_EMPRESA ||
        rol === ROLE_OFERENTE
    );
}

export function normalizarRol(rol: string): RolUsuario | string {
    if (rol === 'ADMIN') {
        return ROLE_ADMIN;
    }

    if (rol === 'EMPRESA') {
        return ROLE_EMPRESA;
    }

    if (rol === 'OFERENTE') {
        return ROLE_OFERENTE;
    }

    return rol;
}