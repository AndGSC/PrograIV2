export interface Candidato {
    id: number;
    identificacion?: string;
    nombre: string;
    nacionalidad?: string;
    telefono: string;
    correo: string;
    residencia: string;
    coincidencia: number;
    cvDisponible?: boolean;
    habilidades: string[];
}

export interface BuscarCandidatosParams {
    palabraClave?: string;
    nivel?: string;
    puestoId?: number;
}