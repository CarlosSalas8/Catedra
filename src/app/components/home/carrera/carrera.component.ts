import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent {

  careerSeleccionada: string = '';

  constructor(private router: Router,private authService: AuthService,
    private firestore: AngularFirestore) {}

    validarcareer() {
      if (!this.careerSeleccionada) {
        alert('Por favor, selecciona una career.');
        return;
      }
    
      this.authService.getCurrentUser().subscribe(async (user) => {
        if (!user) {
          console.error('No hay usuario autenticado.');
          return;
        }
    
        try {
          const userDoc = await this.firestore.collection('users').doc(user.uid).get().toPromise();
          
          if (!userDoc || !userDoc.exists) {
            console.error('No se encontró el usuario en la colección "users".');
            return;
          }
    
          const userData = userDoc.data() as Usuario;
          const role = userData?.role;
    
          switch (role) {
            
            case 'admin':
              console.log('El usuario es administrador, redirigiendo...');
              this.router.navigate(['/home-admin']);
              break;

            case 'teacher':
              console.log('El usuario es teacher, redirigiendo...');
              this.router.navigate(['/home-docente']);
              break;
            
            case 'director':
              console.log('El usuario es director, redirigiendo...');
              this.router.navigate(['/home-director']);
              break;
    
            case 'student':
              if (!userData.career) {
                console.log('El usuario no tenía career. Asignando...');
                await this.firestore.collection('users').doc(user.uid).set(
                  { career: this.careerSeleccionada, role: 'student' },
                  { merge: true }
                );
              } else {
                console.log('El usuario ya tiene una Carrer asignada.');
              }
              this.router.navigate(['/home-ayudante'], { queryParams: { career: this.careerSeleccionada } });
              break;
    
            default:
              console.error('Rol desconocido:', role);
              alert('Rol no válido. Contacte al administrador.');
              break;
          }
        } catch (error) {
          console.error('Error al acceder a los datos del usuario:', error);
        }
      });
    }
    
    
    
    
    
    
    
    
    
    

}
