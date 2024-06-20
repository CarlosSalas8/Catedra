import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = {
    isAuthenticated: true, // Cambia esto según tu lógica de autenticación
    role: 'profesor' // Cambia esto según el rol del usuario autenticado
  };

  constructor(private afAuth: AngularFireAuth) { }

  loginWithEmail(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }

  

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
