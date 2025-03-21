import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map, of, switchMap } from 'rxjs';
import { Auth, getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, User, UserCredential } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from './periodo.service';
import { CanActivate, Router } from '@angular/router';
import { CustomCookieService } from './cookie.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth;

  private userData: any = null;

  activePeriod: any | null = null;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, public periodoService: PeriodoService, private router: Router, private cookieService: CustomCookieService, private httpClient: HttpClient) {
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });
    this.auth = getAuth();
  }

  registerWithEmail(email: string, password: string, name: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (!user) throw new Error('No se pudo crear el usuario');

      // Crear el documento de usuario
      const userData = {
        userID: user.uid,
        email: email,
        name: name,
        role: 'student',
        periodID: this.activePeriod?.id || null,
        career: ""
      };

      this.firestore.collection('teachers', ref => ref.where('email', '==', email))
      .get().toPromise().then((teachers) => {
        if (teachers) {
          userData.role = 'teacher';

          const career = teachers.docs[0].data() as any;
          userData.career = career.career;
        }
      });

      this.firestore.collection('directors', ref => ref.where('email', '==', email))
      .get().toPromise().then((directors) => {
        if (directors) {
          userData.role = 'director';

          const career = directors.docs[0].data() as any;
          userData.career = career.career;
        }
      });

      this.firestore.collection('users').doc(user.uid).set(userData);
      
      
      // Actualizar el nombre del usuario
      return user.updateProfile({
        displayName: name,
      }).then(() => {
        return user;
      });
    });
  }



  loginWithEmail(email: string, password: string) : Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      
      const user = userCredential.user;
      
      if (!user) throw new Error('No se pudo autenticar el usuario');
      
      const userEmail = user.email;
      const uid = user.uid;
      if (!userEmail) throw new Error('No se encontró el email del usuario');

      const token = await user.getIdToken();
      sessionStorage.setItem('userToken', token);

      const adminSnapshot = await this.firestore.collection('users').ref.where('role', '==', 'admin').where('email', '==', userEmail).get();
      const directorSnapshot = await this.firestore.collection('directors').ref.where('email', '==', userEmail).get();
      const teacherSnapshot = await this.firestore.collection('teachers').ref.where('email', '==', userEmail).get();
      const userSnapshot = await this.firestore.collection('users').ref.where('userID', '==', uid).get();

      
      let role = 'student';
      if (!adminSnapshot.empty) role = 'admin';
      else if (!directorSnapshot.empty) role = 'director';
      else if (!teacherSnapshot.empty) role = 'teacher';

      const adminData =  adminSnapshot.docs[0]?.data() as any;
      const directorData =  directorSnapshot.docs[0]?.data() as any;
      const teacherData =  teacherSnapshot.docs[0]?.data() as any;
      const userDataReal = userSnapshot.docs[0]?.data() as any;
      
      const userData = {
        userID: user.uid,
        email: userEmail,
        name: userDataReal.name || user.displayName,
        photoURL: user.photoURL,
        role: role,
        periodID: this.activePeriod?.id || null, 
        career: adminData?.career || directorData?.career || teacherData?.career || userDataReal.career || null
      };

      await this.firestore.collection('users').doc(user.uid).set(userData, { merge: true });

      // if (role === 'teacher') {
      //   await this.createTeacherCollection(user);
      // }

      // 🔹 Guardar usuario en cookies para mantener la sesión
      this.cookieService.setCookie('user', JSON.stringify(userData), 7); // Se guarda por 7 días

      return user;
    })
    .catch(error => {
      alert('Error al iniciar sesión. Verifique sus credenciales.');
    });
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
        tenant: '6eeb49aa-436d-43e6-becd-bbdf79e5077d', // Usa el Tenant ID aquí
      });

      const userCredential = await this.afAuth.signInWithPopup(provider);
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
        name: user.displayName || '',
        photoURL: user.photoURL || '',
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
    } catch (error) {
      console.error("Hubo un error durante el inicio de sesión con Microsoft:", error);
      alert("Hubo un error, vuelva a iniciar sesión o comuníquese con el administrador del sistema.");
      throw error;
    }
  }

  getActivities(): Observable<any[]> {
    return this.firestore.collection('activities').valueChanges();
  }

  private async createTeacherCollection(user: firebase.default.User) {
    const teacherDocRef = this.firestore.collection('teachers').doc(user.uid);

    try {
      // Fetch the document using a snapshot
      const teacherDoc = await teacherDocRef.get().toPromise();

      // Check if the document exists
      if (teacherDoc && !teacherDoc.exists) {
        // Buscar en la colección 'plazas' el email del director, subject y parallel asociado al docente
        const plazaQuerySnapshot = await this.firestore
          .collection('plazas', (ref) => ref.where('emailTeacher', '==', user.email))
          .get()
          .toPromise();

        let emailDirector = null;
        let name = null;
        let subject = null;
        let parallel = null;

        if (plazaQuerySnapshot && !plazaQuerySnapshot.empty) {
          const plazaData = plazaQuerySnapshot.docs[0].data() as {
            emailDirector?: string;
            nameTeacher?: string;
            subject?: string;
            parallel?: string;
          };

          emailDirector = plazaData.emailDirector || null; // Obtener el email del director
          name = plazaData.nameTeacher || null; // Obtener el email del director
          subject = plazaData.subject || null; // Obtener la materia (subject)
          parallel = plazaData.parallel || null; // Obtener el paralelo (parallel)

          
        } else {
          console.warn('No se encontró plaza asociada a este docente.');
        }

        // Crear el documento en la colección 'teachers'
        await teacherDocRef.set({
          id: user.uid,
          name: name,
          email: user.email,
          emailDirector: emailDirector, // Se agrega el email del director
          subject: subject, // Se agrega la materia
          parallel: parallel, // Se agrega el paralelo
          periodID: this.activePeriod?.id || null, // Asegurar que no falle si activePeriod no está definido
        }); 
      } else if (!teacherDoc) {
        console.error('Failed to retrieve teacher document snapshot');
      }
    } catch (error) {
      console.error('Error creating teacher collection:', error);
    }
  }

  getCurrentUser4(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore
            .collection('users')
            .doc(user.uid)
            .valueChanges();
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
      const userDoc = await this.firestore
        .collection('users')
        .doc(user.uid)
        .get()
        .toPromise();
      return userDoc?.data();
    }
    return null;
  }

  getPlazas(): Observable<any[]> {
    return this.firestore.collection('plazas').valueChanges({ idField: 'id' });
  }

  getPostulant(): Observable<any[]> {
    return this.firestore
      .collection('postulant')
      .valueChanges({ idField: 'id' });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      sessionStorage.removeItem('userToken');
      this.cookieService.deleteCookie('user'); // Eliminar la cookie de usuario
      this.router.navigate(['/home']);
    });
  }

  getCurrentUserRole(): Observable<string> {
    return this.cookieService.getCookie('user') ? of(JSON.parse(this.cookieService.getCookie('user')).role) : of('student'); 
  }

  getCurrentUser() {
    return this.afAuth.authState.pipe(map((user) => user || null));
  }

  tokenValidation(accessToken: string): Observable<Object> {
    // headers with authorization token
    // manage the token validation 200 or 401

    return this.httpClient.get(
      'https://us-central1-catedra-458c0.cloudfunctions.net/verifyToken',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }
}