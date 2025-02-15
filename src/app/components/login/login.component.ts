import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Usuario } from '../models/usuario.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false; // Estado de carga
  activePeriod: any | null = null;
  user: any = null;


  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, public periodoService: PeriodoService, private firestore: AngularFirestore) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

    });

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

  }



  ngOnInit(): void {
    this.setupMobileMenuToggle();
  }


  async loginWithMicrosoft() {
    this.loading = true;
    this.errorMessage = '';

    try {
      const user = await this.authService.loginWithMicrosoft();

      if (!user) {
        console.error('Error inesperado: no se obtuvo un usuario tras iniciar sesión.');
        this.loading = false;
        return;
      }

      // Obtener el documento del usuario desde Firestore
      const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();

      if (userDoc?.exists) {
        this.authService.tokenValidation((user.multiFactor as any).user.accessToken).subscribe(
          async (data) => {
            if (!data) {
              console.error('Error inesperado: no se obtuvieron datos del usuario.');
              alert('Error inesperado: no se obtuvieron datos del usuario.');
              this.loading = false;
              return;
            }
            const userData = userDoc.data() as Usuario;
            const role = userData?.role;
            const career = userData?.career;
            const validated = userData?.validated;

            // Asegurarse de que el rol sea válido y redirigir
            if (role) {
              if (role === 'admin') {
                
                this.router.navigate(['/home-admin']);
              } else if (role === 'teacher' || role === 'director') {
                const homeRoute = role === 'teacher' ? '/home-docente' : '/home-director';
                
                this.router.navigate([homeRoute]);
              } else if (role === 'student') {
                if (career) {
                  
                  this.router.navigate(['/home-ayudante'], { queryParams: { career: career, validated } });
                } else {
                  
                  this.router.navigate(['/carrera'], { queryParams: { validated } });
                }
              } else {
                console.error('Rol desconocido:', role);
                alert('Rol no válido. Contacte al administrador.');
              }
            } else {
              console.error('Rol no encontrado en los datos del usuario.');
              alert('No se pudo obtener el rol del usuario. Contacte al administrador.');
              this.router.navigate(['/carrera']);
            }
          }, (error) => {
            console.error('Error al intentar obtener los datos del usuario');
            this.loading = false;
            alert('Error al intentar obtener los datos del usuario.');
            return;
          }
        );

      } else {
        console.error('Usuario no encontrado en la colección "users".');
        this.router.navigate(['/carrera']);
      }
    } catch (error) {
      console.error('Error en el login con Microsoft:', error);
      this.errorMessage = 'No se pudo iniciar sesión con Microsoft. Intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  }




  loginWithGoogle() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.loginWithGoogle().then(
      async (user) => {
        if (!user) {
          console.error('Error inesperado: no se obtuvo un usuario tras iniciar sesión.');
          alert('Error inesperado: no se obtuvo un usuario tras iniciar sesión.');
          this.loading = false;
          return;
        }

        

        try {
          this.authService.tokenValidation((user.multiFactor as any).user.accessToken).subscribe(
            async (data) => {
              if (!data) {
                console.error('Error inesperado: no se obtuvieron datos del usuario.');
                this.loading = false;
                return;
              }
              const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();

              if (userDoc?.exists) {
                const userData = userDoc.data() as Usuario;
                const role = userData?.role;
                const career = userData?.career;
                const validated = userData?.validated;
                const email = user.email; // Obtener el email del usuario autenticado

                if (role) {
                  if (role === 'admin') {
                   
                    this.router.navigate(['/home-admin']);
                  }
                  else if (role === 'teacher') {
                    
                    this.router.navigate(['/home-docente', email]); // Enviar email en la ruta
                  }
                  else if (role === 'director') {
                    
                    this.router.navigate(['/home-director']); // No enviar email
                  }
                  else if (role === 'student') {
                    if (career) {
                      
                      this.router.navigate(['/home-ayudante'], { queryParams: { career: career, validated } });
                    } else {
                      
                      this.router.navigate(['/carrera'], { queryParams: { validated } });
                    }
                  }
                  else {
                    console.error('Rol desconocido:', role);
                    alert('Rol no válido. Contacte al administrador.');
                  }
                } else {
                  console.error('Rol no encontrado en los datos del usuario.');
                  alert('No se pudo obtener el rol del usuario. Contacte al administrador.');
                  this.router.navigate(['/carrera']);
                }
              } else {
                console.error('Usuario no encontrado en la colección "users".');
                this.router.navigate(['/carrera']);
              }
            },
            (error) => {
              console.error('Error al validar token:', error);
            }
          );
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          alert('Error al intentar obtener los datos del usuario.');
          this.router.navigate(['/carrera']);
        } finally {
          this.loading = false;
        }
      },
      (error) => {
        console.error('Error en el login con Google:', error);
        this.errorMessage = 'No se pudo iniciar sesión con Google. Intenta nuevamente.';
        this.loading = false;
      }
    );
}



  setupMobileMenuToggle(): void {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconClosed = menuButton?.children[2] as HTMLElement;
    const menuIconOpened = menuButton?.children[3] as HTMLElement;

    if (menuButton) {
      menuButton.addEventListener('click', () => {
        if (mobileMenu) {
          mobileMenu.classList.toggle('hidden');
        }
        if (menuIconClosed && menuIconOpened) {
          menuIconClosed.classList.toggle('hidden');
          menuIconOpened.classList.toggle('hidden');
        }
      });
    }
  }



}



