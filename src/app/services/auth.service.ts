import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat';
import { Observable, map, of, switchMap } from 'rxjs';
import { GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from './periodo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = {
    isAuthenticated: true, // Cambia esto según tu lógica de autenticación
    role: 'default' // Cambia esto según el rol del usuario autenticado
  };
  activePeriod: any | null = null;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, public periodoService: PeriodoService) { 
    this.periodoService.activePeriod$.subscribe(periodo => {
      this.activePeriod = periodo;
    });
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      return this.firestore.collection('docentes').ref.where('email', '==', email).get().then(querySnapshot => {
        if (querySnapshot.empty) {
          throw new Error('No se encontró el usuario en la base de datos de docentes.');
        }
        return user;
      });
    });
  }


  loginWithEmail(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  loginWithGoogle() {
    return this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(async (userCredential) => {
      const user = userCredential.user;
      
      if (!user) throw new Error('No se pudo autenticar el usuario');
    
      const userEmail = user.email;
      if (!userEmail) throw new Error('No se encontró el correo del usuario');
    
      // Verificar si el usuario está en la colección de administradores
      const adminSnapshot = await this.firestore.collection('usuarios').ref.where('rol', '==', 'admin').where('email', '==', userEmail).get();
    
      // Verificar si el usuario está en la colección 'directores'
      const docenteSnapshot = await this.firestore.collection('directores').ref.where('email', '==', userEmail).get();
    
      // Verificar si el usuario está en la colección 'plazas'
      const plazaSnapshot = await this.firestore.collection('plazas').ref.where('correo', '==', userEmail).get();
    
      // Determinar el rol
      let rol = 'student'; // Por defecto el rol es 'student'
      
      if (!adminSnapshot.empty) {
        rol = 'admin'; // Si el usuario es un administrador
      } else if (!docenteSnapshot.empty) {
        rol = 'director'; // Si el usuario es un director
      } else if (!plazaSnapshot.empty) {
        rol = 'docente'; // Si el usuario es un docente
      }
    
      // Crear o actualizar SOLO el usuario autenticado en la colección 'usuarios' con el rol correspondiente
      await this.firestore.collection('usuarios').doc(user.uid).set({
        usuarioId: user.uid,
        email: userEmail,
        name: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
        rol: rol,
        periodoId: this.activePeriod.id
      }, { merge: true });
    
      // Retorna el usuario autenticado
      return user;
    }).catch(error => {
      console.error('Error en login con Google:', error);
      throw error;
    });
  }

  getCurrentUser4(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.collection('usuarios').doc(user.uid).valueChanges();
        } else {
          return [];
        }
      })
    );
  }

  getPlazas(): Observable<any[]> {
    return this.firestore.collection('plazas').valueChanges({ idField: 'id' });
  }

  
  
  
  
  
  


  loginWithMicrosoft() {
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: 'select_account' // Solicita al usuario elegir una cuenta, si es necesario.
    });
  
    return this.afAuth.signInWithPopup(provider)
      .then(userCredential => {
        const user = userCredential.user;
        if (!user) throw new Error('No se pudo autenticar el usuario con Microsoft.');
        return user; // Devuelve directamente el usuario autenticado.
      })
      .catch(error => {
        console.error('Error en login con Microsoft:', error);
        throw error;
      });
  }
  
  

  logout() {
    return this.afAuth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.authState;
  }

  getCurrentUser2() {
    return this.afAuth.authState.pipe(map(user => user || null));
  }
  


  isAuthenticated(): boolean {
    return this.user.isAuthenticated;
  }

  isAdmin(): boolean {
    return this.user.role === 'admin';
  }

  isDocente(): boolean {
    return this.user.role === 'docente';
  }

  isAlumno(): boolean {
    return this.user.role === 'alumno';
  }

}
