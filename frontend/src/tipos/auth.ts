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

export interface SesionUsuario {
    token: string;
    rol: string;
    correo: string;
}