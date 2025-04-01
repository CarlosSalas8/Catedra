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

    // this.updatePostulants();
  }

  // Recorrer todos los postulant para actualizar los datos de los estudiantes de la plaza como parallel, emailTeacher, emailDirector, directorsName, directorsId, academicCycle, career, currculum, faculty, modality, nameTeacher, subject desde el atributo plazaID
  private async updatePostulants(): Promise<void> {
    const postulants = await this.firestore.collection('postulant').get().toPromise();

    if (!postulants) return;

    postulants.docs.forEach(async postulant => {
      const postulantData = postulant.data() as any;
      const plaza = await this.firestore.collection('plazas').doc(postulantData.plazaID).get().toPromise();
      const plazaData = plaza!.data() as any;

      await postulant.ref.update({
        parallel: plazaData.parallel,
        emailTeacher: plazaData.emailTeacher,
        emailDirector: plazaData.emailDirector,
        directorsName: plazaData.directorsName,
        directorsId: plazaData.directorsId,
        academicCycle: plazaData.academicCycle,
        career: plazaData.career,
        curriculum: plazaData.curriculum,
        faculty: plazaData.faculty,
        modality: plazaData.modality,
        nameTeacher: plazaData.nameTeacher,
        subject: plazaData.subject
      });
    });
  }
  


  private cargarActividades(emailDocente: string): void {
    this.studients$ = this.firestore.collection('postulant', ref => {
      if (this.user.role === 'teacher') {
        return ref.where('emailTeacher', '==', emailDocente);
      }

      if (this.user.role === 'director') {
        return ref.where('emailDirector', '==', emailDocente);
      }

      

      return ref.where('validated', '==', true);
    }).valueChanges();
  }
}