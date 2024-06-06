import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = {
    isAuthenticated: true, // Cambia esto según tu lógica de autenticación
    role: 'profesor' // Cambia esto según el rol del usuario autenticado
  };

  constructor() { }

  isAuthenticated(): boolean {
    return this.user.isAuthenticated;
  }

  isAdmin(): boolean {
    return this.user.role === 'admin';
  }

  isProfesor(): boolean {
    return this.user.role === 'profesor';
  }

  isAlumno(): boolean {
    return this.user.role === 'alumno';
  }
}
