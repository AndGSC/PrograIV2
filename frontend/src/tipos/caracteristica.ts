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

export interface Habilidad {
    id: number;
    caracteristica: string;
    nivel: string;
}

export interface AgregarHabilidadRequest {
    caracteristica: string;
    nivel: string;
}