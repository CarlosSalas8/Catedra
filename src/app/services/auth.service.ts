import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat';
import { Observable, map, of, switchMap } from 'rxjs';
import { GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from './periodo.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  
  activePeriod: any | null = null;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, public periodoService: PeriodoService, private router: Router) {
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
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
      if (!userEmail) throw new Error('No se encontró el email del usuario');

      const token = await user.getIdToken();  // <-- Obtén el token de Firebase
      console.log("Token generado:", token);
      sessionStorage.setItem('userToken', token);  // <-- Guarda el token en sessionStorage

      // Verificar si el usuario está en la colección de administradores
      const adminSnapshot = await this.firestore.collection('users').ref.where('role', '==', 'admin').where('email', '==', userEmail).get();

      // Verificar si el usuario está en la colección 'directors'
      const directorSnapshot = await this.firestore.collection('directors').ref.where('email', '==', userEmail).get();

      // Verificar si el usuario está en la colección 'plazas', verificar teacher
      const teacherSnapshot = await this.firestore.collection('plazas').ref.where('emailTeacher', '==', userEmail).get();

      // Determinar el role
      let role = 'student'; // Por defecto el role es 'student'

      if (!adminSnapshot.empty) {
        role = 'admin'; // Si el usuario es un administrador
      } else if (!directorSnapshot.empty) {
        role = 'director'; // Si el usuario es un director
      } else if (!teacherSnapshot.empty) {
        role = 'teacher'; // Si el usuario es un teacher
      }

      // Crear o actualizar SOLO el usuario autenticado en la colección 'users' con el rol correspondiente
      await this.firestore.collection('users').doc(user.uid).set({
        userID: user.uid,
        email: userEmail,
        name: user.displayName,
        photoURL: user.photoURL,
        lastLogin: new Date(),
        role: role,
        periodID: this.activePeriod.id
      }, { merge: true });

      if (role === 'teacher') {
        await this.createTeacherCollection(user);
      }

      // Retorna el usuario autenticado
      return user;
    }).catch(error => {
      console.error('Error en login con Google:', error);
      throw error;
    });
  }




  getActivities(): Observable<any[]> {
    return this.firestore.collection('activities').valueChanges();
  }




  private async createTeacherCollection(user: firebase.default.User) {
    const teacherDocRef = this.firestore.collection('teachers').doc(user.uid);

    // Fetch the document using a snapshot
    const teacherDoc = await teacherDocRef.get().toPromise();

    // Check if the document exists
    if (teacherDoc && !teacherDoc.exists) {
      await teacherDocRef.set({
        id: user.uid,
        name: user.displayName,
        email: user.email,
        periodID: this.activePeriod.id // Customize this value as needed
      });
      console.log('Teacher collection created successfully');
    } else if (!teacherDoc) {
      console.error('Failed to retrieve teacher document snapshot');
    }
  }



  getCurrentUser4(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).valueChanges();
        } else {
          return [];
        }
      })
    );
  }

  async getCurrentUser5(): Promise<any> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();
      return userDoc?.data();
    }
    return null;
  }

  getPlazas(): Observable<any[]> {
    return this.firestore.collection('plazas').valueChanges({ idField: 'id' });
  }

  getPostulant(): Observable<any[]> {
    return this.firestore.collection('postulant').valueChanges({ idField: 'id' });
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
    this.afAuth.signOut().then(() => {
      sessionStorage.removeItem('userToken');
      console.log('Sesión cerrada');
      this.router.navigate(['/home']);
    });
  }

  



  getCurrentUser() {
    return this.afAuth.authState.pipe(map(user => user || null));
  }




}

