import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map, of, switchMap } from 'rxjs';
import { Auth, getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from './periodo.service';
import { CanActivate, Router } from '@angular/router';
import { CustomCookieService } from './cookie.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;

  activePeriod: any | null = null;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, public periodoService: PeriodoService, private router: Router, private cookieService: CustomCookieService) {
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });
    this.auth = getAuth();
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
  
      const token = await user.getIdToken();
      sessionStorage.setItem('userToken', token);
  
      const adminSnapshot = await this.firestore.collection('users').ref.where('role', '==', 'admin').where('email', '==', userEmail).get();
      const directorSnapshot = await this.firestore.collection('directors').ref.where('email', '==', userEmail).get();
      const teacherSnapshot = await this.firestore.collection('plazas').ref.where('emailTeacher', '==', userEmail).get();
  
      let role = 'student';
      if (!adminSnapshot.empty) role = 'admin';
      else if (!directorSnapshot.empty) role = 'director';
      else if (!teacherSnapshot.empty) role = 'teacher';
  
      const userData = {
        userID: user.uid,
        email: userEmail,
        name: user.displayName,
        photoURL: user.photoURL,
        role: role,
        periodID: this.activePeriod?.id || null
      };
  
      await this.firestore.collection('users').doc(user.uid).set(userData, { merge: true });
  
      if (role === 'teacher') {
        await this.createTeacherCollection(user);
      }
  
      // 🔹 Guardar usuario en cookies para mantener la sesión
      this.cookieService.setCookie('user', JSON.stringify(userData), 7); // Se guarda por 7 días
  
      return user;
    }).catch(error => {
      console.error('Error en login con Google:', error);
      throw error;
    });
  }
  








  async loginWithMicrosoft() {
  try {
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      tenant: '6eeb49aa-436d-43e6-becd-bbdf79e5077d' // Usa el Tenant ID aquí
    });
    const result = await this.afAuth.signInWithPopup(provider);
    this.router.navigate(['/bienvenido']);
  } catch (error) {
    console.error("Hubo un error durante el inicio de sesión con Microsoft:", error);
    alert("Hubo un error, vuelva a iniciar sesión o comuníquese con el administrador del sistema.");
  }
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
    const userCookie = this.cookieService.getCookie('user');
    if (userCookie) {
      return JSON.parse(userCookie); // Si hay cookie, retornamos el usuario guardado
    }
  
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





  logout() {
    this.afAuth.signOut().then(() => {
      sessionStorage.removeItem('userToken');
      this.cookieService.deleteCookie('user'); // Eliminar la cookie de usuario
      console.log('Sesión cerrada');
      this.router.navigate(['/home']);
    });
  }
  





  getCurrentUser() {
    return this.afAuth.authState.pipe(map(user => user || null));
  }




}

