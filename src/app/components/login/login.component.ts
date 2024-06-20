import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;

  constructor(private authService: AuthService,private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  

  ngOnInit(): void {
    this.setupMobileMenuToggle();
  }


  loginWithEmail() {
    const { email, password } = this.loginForm.value;
    console.log('Correo:', email, 'Contraseña:', password);  
    this.authService.loginWithEmail(email, password).then(
      (res) => {
        console.log('Login exitoso', res);
      },
      (err) => {
        console.error('Error en el login', err);
      }
    );
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle().then(
      (res) => {
        console.log('Login con Google exitoso', res);
        this.router.navigate(['/planificacion']); 
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
