export interface Estudiante {
    id: string;
    emailAssistant: string;
    files?: {
        ayudante_catedra?: string;
        conflicto_interes?: string;
        evaluacion_becario?: string;
    };
    validated?: boolean;
    validated2?: boolean;
}