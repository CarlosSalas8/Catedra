import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent implements OnInit {

  careerSeleccionada: string = '';
  carreras: string[] = [];

  constructor(private router: Router, private authService: AuthService,
    private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  // Método para obtener las carreras desde Firebase
  cargarCarreras() {
    this.firestore.collection('careers').valueChanges().subscribe((data: any[]) => {
      this.carreras = data.map(item => item.name); // Suponiendo que el campo en Firebase se llama "nombre"
    });
  }

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
            
            this.router.navigate(['/home-admin']);
            break;

          case 'teacher':
            
            this.router.navigate(['/home-docente']);
            break;

          case 'director':
            
            this.router.navigate(['/home-director']);
            break;

          case 'student':
            if (!userData.career) {
              
              await this.firestore.collection('users').doc(user.uid).set(
                { career: this.careerSeleccionada, role: 'student' },
                { merge: true }
              );
            } else {
              
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
