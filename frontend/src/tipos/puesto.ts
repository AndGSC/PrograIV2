export interface RequisitoPuesto {
    caracteristica: string;
    nivel: string;
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

export interface PuestoEmpresa {
    id: number;
    titulo: string;
    descripcion: string;
    salario: string;
    tipoPublicacion: string;
    estado: string;
}

export interface PublicarPuestoRequest {
    titulo: string;
    descripcion: string;
    salario: string;
    tipoPublicacion: string;
    requisitos: RequisitoPuesto[];
}