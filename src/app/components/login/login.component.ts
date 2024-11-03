import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService,private router: Router, private fb: FormBuilder, public periodoService: PeriodoService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  

  ngOnInit(): void {
    this.setupMobileMenuToggle();
  }

  
  loginWithEmail() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.login(email, password).then(user => {
        console.log('Login exitoso', user);
        // Redirigir al usuario a la página principal u otra ruta deseada
        this.router.navigate(['/ventanas']); // Ejemplo de redirección a '/dashboard'
      }).catch(error => {
        this.errorMessage = error.message; // Mostrar mensaje de error
      });
    }
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then(
      (res) => {
        console.log('Login con Google exitoso', res);
        this.router.navigate(['/carrera']); 
      },
      (err) => {
        console.error('Error en el login con Google', err);
      }
    );
  }

  logout() {
    this.authService.logout();
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
