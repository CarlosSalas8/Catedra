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

  carreraSeleccionada: string = '';

  constructor(private router: Router,private authService: AuthService,
    private firestore: AngularFirestore) {}

    validarCarrera() {
      if (!this.carreraSeleccionada) {
        alert('Por favor, selecciona una carrera.');
        return;
      }
    
      this.authService.getCurrentUser2().subscribe(async (user) => {
        if (!user) {
          console.error('No hay usuario autenticado.');
          return;
        }
    
        try {
          const userDoc = await this.firestore.collection('usuarios').doc(user.uid).get().toPromise();
          
          if (!userDoc || !userDoc.exists) {
            console.error('No se encontró el usuario en la colección "usuarios".');
            return;
          }
    
          const userData = userDoc.data() as Usuario;
          const rol = userData?.rol;
    
          switch (rol) {
            
            case 'admin':
              console.log('El usuario es administrador, redirigiendo...');
              this.router.navigate(['/home-admin']);
              break;

            case 'docente':
              console.log('El usuario es docente, redirigiendo...');
              this.router.navigate(['/home-docente']);
              break;
            
            case 'director':
              console.log('El usuario es director, redirigiendo...');
              this.router.navigate(['/home-director']);
              break;
    
            case 'student':
              if (!userData.asignatura) {
                console.log('El usuario no tenía asignatura. Asignando...');
                await this.firestore.collection('usuarios').doc(user.uid).set(
                  { asignatura: this.carreraSeleccionada, rol: 'student' },
                  { merge: true }
                );
              } else {
                console.log('El usuario ya tiene una asignatura asignada.');
              }
              this.router.navigate(['/home-ayudante'], { queryParams: { carrera: this.carreraSeleccionada } });
              break;
    
            default:
              console.error('Rol desconocido:', rol);
              alert('Rol no válido. Contacte al administrador.');
              break;
          }
        } catch (error) {
          console.error('Error al acceder a los datos del usuario:', error);
        }
      });
    }
    
    
    
    
    
    
    
    
    
    

}
