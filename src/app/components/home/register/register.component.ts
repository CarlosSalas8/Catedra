import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
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
        name: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      });
  
      this.periodoService.activePeriod$.subscribe(period => {
        this.activePeriod = period;
      });
  
    }
  
  
  
    ngOnInit(): void {
      this.setupMobileMenuToggle();
    }


    registerWithEmail() {
      this.loading = true;
      this.errorMessage = '';
  
      let { email, password, name, confirmPassword } = this.loginForm.value;

      name = name.trim().toUpperCase();
      email = email.trim().toLowerCase();
  
      if (password !== confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        this.loading = false;
        return;
      }
  
      this.authService.registerWithEmail(email, password, name).then(
        async (user) => {
          if (!user) {
            console.error('Error inesperado: no se obtuvo un usuario tras registrar.');
            alert('Error inesperado: no se obtuvo un usuario tras registrar.');
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
  
                  if (role) {
                    if (role === 'admin') {
                      this.router.navigate(['/home-admin']);
                    }
                    else if (role === 'teacher') {
                      this.router.navigate(['/home-docente']);
                    }
                    else if (role === 'director') {
                      this.router.navigate(['/home-director']);
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
              (error => {
                console.error('Error al validar token:', error);
              }
            ));
          } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            alert('Error al intentar obtener los datos del usuario.');
            this.router.navigate(['/carrera']);
          }
        });
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
