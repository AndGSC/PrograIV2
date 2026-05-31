export const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const API_PREFIX = '/api';

export const STORAGE_TOKEN_KEY = 'token';
export const STORAGE_ROL_KEY = 'rol';
export const STORAGE_CORREO_KEY = 'correo';

export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_EMPRESA = 'ROLE_EMPRESA';
export const ROLE_OFERENTE = 'ROLE_OFERENTE';

export type RolUsuario =
    | typeof ROLE_ADMIN
    | typeof ROLE_EMPRESA
    | typeof ROLE_OFERENTE;

export const RUTA_HOME = '/';
export const RUTA_LOGIN = '/login';

export const RUTA_ADMIN = '/admin';
export const RUTA_EMPRESA = '/empresa';
export const RUTA_OFERENTE = '/oferente';

export const ENDPOINT_LOGIN = `${API_PREFIX}/auth/login`;
export const ENDPOINT_USUARIO_ACTUAL = `${API_PREFIX}/auth/me`;

export const ENDPOINT_REGISTRO_EMPRESA = `${API_PREFIX}/public/empresas/registro`;
export const ENDPOINT_REGISTRO_OFERENTE = `${API_PREFIX}/public/oferentes/registro`;
export const ENDPOINT_PUESTOS_PUBLICOS = `${API_PREFIX}/public/puestos`;
export const ENDPOINT_BUSCAR_PUESTOS = `${API_PREFIX}/public/puestos/buscar`;

export const ENDPOINT_ADMIN_EMPRESAS_PENDIENTES = `${API_PREFIX}/admin/empresas/pendientes`;
export const ENDPOINT_ADMIN_OFERENTES_PENDIENTES = `${API_PREFIX}/admin/oferentes/pendientes`;
export const ENDPOINT_ADMIN_CARACTERISTICAS = `${API_PREFIX}/admin/caracteristicas`;
export const ENDPOINT_ADMIN_REPORTES = `${API_PREFIX}/admin/reportes`;

export const ENDPOINT_EMPRESA_PUESTOS = `${API_PREFIX}/empresa/puestos`;
export const ENDPOINT_EMPRESA_CANDIDATOS = `${API_PREFIX}/empresa/candidatos`;

export const ENDPOINT_OFERENTE_PERFIL = `${API_PREFIX}/oferente/perfil`;
export const ENDPOINT_OFERENTE_HABILIDADES = `${API_PREFIX}/oferente/habilidades`;
export const ENDPOINT_OFERENTE_CV = `${API_PREFIX}/oferente/cv`;

export const MENSAJE_ERROR_GENERAL = 'Ocurrió un error al procesar la solicitud.';
export const MENSAJE_SESION_EXPIRADA = 'La sesión expiró. Inicie sesión nuevamente.';