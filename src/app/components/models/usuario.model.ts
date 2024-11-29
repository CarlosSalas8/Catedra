export interface Usuario {
    email: string;
    name: string;
    photoURL: string;
    lastLogin: Date;
    rol: 'docente' | 'director' | 'student' | 'admin'; // Define los posibles valores del rol
    asignatura?: string; // Optional, solo si se requiere para algunos usuarios
    
  }