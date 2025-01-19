export interface Usuario {
    email: string;
    name: string;
    photoURL: string;
    lastLogin: Date;
    role: 'teacher' | 'director' | 'student' | 'admin'; // Define los posibles valores del role
    subject?: string; // Optional, solo si se requiere para algunos usuarios
    validated: boolean;
  }