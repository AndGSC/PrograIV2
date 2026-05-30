export interface ApiMensaje {
    mensaje: string;
}

export interface ApiErrorResponse {
    mensaje?: string;
    message?: string;
    error?: string;
    status?: number;
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