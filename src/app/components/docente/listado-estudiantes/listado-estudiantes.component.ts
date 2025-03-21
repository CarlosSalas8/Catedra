import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-listado-estudiantes',
  templateUrl: './listado-estudiantes.component.html',
  styleUrls: ['./listado-estudiantes.component.css']
})
export class ListadoEstudiantesComponent {
  studients$: Observable<any[]> | undefined;
  user!: { role: 'teacher' | 'admin' | 'director' | 'student' };
  protected roleRedirect: { [key in 'teacher' | 'student' | 'director' | 'admin']: string } = {
    teacher: 'informe-docente',
    student: 'informe',
    director: 'informe-director',
    admin: 'informe-admin'
  }

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getCurrentUser5();

    this.route.paramMap.subscribe(params => {
      const emailDocente = params.get('email');

      if (emailDocente) {
        this.cargarActividades(emailDocente);
      } else {
        // Si no viene email en la URL, usar el del usuario autenticado
        this.authService.getCurrentUser().subscribe(currentUser => {
          if (currentUser?.email) {
            this.cargarActividades(currentUser.email);
          } else {
            console.error('No hay un usuario autenticado.');
          }
        });
      }
    });
  }

  private cargarActividades(emailDocente: string): void {
    this.studients$ = this.firestore.collection('postulant', ref => {
      if (this.user.role === 'teacher') {
        return ref.where('emailTeacher', '==', emailDocente);
      }

      return ref.where('validated', '==', true);
    }).valueChanges();
  }
}