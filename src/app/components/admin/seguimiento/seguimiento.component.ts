import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {
  directors$: Observable<any[]> | undefined;
  docentes$: Observable<any[]> | undefined;
  estudiantes$: Observable<any[]> | undefined;
  activities$: Observable<any[]> | undefined;
  activityDetails$: Observable<any> | undefined;
  files: any[] = [];
  selectedDirectorEmail: string | null = null;
  selectedDirectorName: Observable<string> = of('');
  selectedDocenteEmail: string | null = null;
  selectedEstudianteEmail: string | null = null;

  selectedDocenteName: Observable<string> = of('');

  selectedCareer: string = '';
  order: 'asc' | 'desc' = 'asc';	

  searchTerm: string = '';

  careers: any[] = [];
  user: any;


  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.fetchData('careers');
    
    this.user = await this.authService.getCurrentUser5();

    this.filterByCareer();
  }

  // Filtro por carrera 
  filterByCareer() {
    this.directors$ = this.firestore.collection('directors', ref => {
      // Si no es administrador, filtrar por la carrera del usuario
      if (this.user.role !== 'admin') {
        return ref.where('career', '==', this.user.career).orderBy('name', this.order);
      }
      
      if (this.selectedCareer === '') {
        return ref.orderBy('name', this.order);
      }
      
      return ref.where('career', '==', this.selectedCareer).orderBy('name', this.order)
    }).valueChanges();
  }

  sortDirectores() {
    this.filterByCareer();
  }

  searchDirectors() {
    this.directors$ = this.firestore.collection('directors', ref => {
      // Si no es administrador, filtrar por la carrera del usuario
      if (this.user.role !== 'admin') {
        return ref.where('career', '==', this.user.career)
                  .orderBy('name', this.order)
                  .startAt(this.searchTerm)
                  .endAt(this.searchTerm + '\uf8ff');
      }
      
      if (this.selectedCareer === '') {
        return ref.orderBy('name', this.order)
                  .startAt(this.searchTerm)
                  .endAt(this.searchTerm + '\uf8ff');
      }
      
      return ref.where('career', '==', this.selectedCareer)
                .orderBy('name', this.order)
                .startAt(this.searchTerm)
                .endAt(this.searchTerm + '\uf8ff');
    }).valueChanges();
  }

  toggleDocentes(directorEmail: string) {
    if (this.selectedDirectorEmail === directorEmail) {
      this.cerrarTodo();
    } else {
      this.cerrarTodo();
      this.selectedDirectorEmail = directorEmail;
      this.docentes$ = this.firestore.collection('teachers', ref =>
        ref.where('emailDirector', '==', directorEmail)
      ).valueChanges();

      // Obtener el nombre del director
      this.selectedDirectorName = this.firestore.collection('directors', ref =>
        ref.where('email', '==', directorEmail)
      ).valueChanges().pipe(
        map((directors: any[]) => (directors.length > 0 ? directors[0]['name'] : ''))
      );
    }
  }

  toggleEstudiantes(docenteEmail: string) {
    if (this.selectedDocenteEmail === docenteEmail) {
      this.selectedDocenteEmail = null;
      this.estudiantes$ = undefined;
      this.selectedDocenteName = of('');
    } else {
      this.selectedDocenteEmail = docenteEmail;

      // Obtener el nombre del docente correspondiente
      this.selectedDocenteName = this.firestore.collection('teachers', ref =>
        ref.where('email', '==', docenteEmail)
      ).valueChanges().pipe(
        map((teachers: any[]) => (teachers.length > 0 ? teachers[0]['name'] : ''))
      );

      // Cargar los estudiantes
      this.estudiantes$ = this.firestore.collection('activities', ref =>
        ref.where('emailTeacher', '==', docenteEmail)
      ).valueChanges().pipe(
        map((activities: any[]) => {
          const uniqueStudents = new Map();
          activities.forEach(activity => {
            if (!uniqueStudents.has(activity.assistant)) {
              uniqueStudents.set(activity.assistant, activity);
            }
          });
          return Array.from(uniqueStudents.values());
        })
      );

      // Resetear actividades y detalles de actividades
      this.selectedEstudianteEmail = null;
      this.activities$ = undefined;
      this.activityDetails$ = undefined;
      this.files = [];
    }
  }


  toggleActividades(estudianteEmail: string) {
    if (this.selectedEstudianteEmail === estudianteEmail) {
      this.selectedEstudianteEmail = null;
      this.activities$ = undefined;
      this.activityDetails$ = undefined;
    } else {
      this.selectedEstudianteEmail = estudianteEmail;
      this.activities$ = this.firestore.collection('activities', ref =>
        ref.where('assistant', '==', estudianteEmail)
      ).valueChanges();
    }
  }

  // Función para cerrar todo cuando se cambia de sección
  cerrarTodo() {
    this.selectedDirectorEmail = null;
    this.selectedDirectorName = of('');
    this.docentes$ = undefined;

    this.selectedDocenteEmail = null;
    this.estudiantes$ = undefined;

    this.selectedEstudianteEmail = null;
    this.activities$ = undefined;
    this.activityDetails$ = undefined;
    this.files = [];
  }

  loadActivityDetails(activityId: string) {
    this.activityDetails$ = this.firestore.collection('activities').doc(activityId).valueChanges();
    this.loadFiles(activityId);
  }

  loadFiles(activityId: string) {
    const filePath = `actividades/${activityId}/`;
    this.files = [];
    this.storage.ref(filePath).listAll().subscribe(result => {
      result.items.forEach(item => {
        item.getDownloadURL().then(url => {
          if (!this.files.some(file => file.url === url)) {
            this.files.push({ name: item.name, url: url });
          }
        });
      });
    });
  }

  closeActivityDetails() {
    this.activityDetails$ = undefined;
    this.files = [];
  }

  selectFile(fileUrl: string) {
    window.open(fileUrl, '_blank');
  }

  fetchData(collection: string): void {
    this.firestore.collection(collection).snapshotChanges().subscribe((data: any) => {
      let result = data.map((doc: any) => ({
        id: doc.payload.doc.id,
        ...doc.payload.doc.data()
      }));

      // if (collection === 'academicCycles') {
      //   this.academicCycles = result.sort((a: { name: string; }, b: { name: string; }) => {
      //     const numA = parseInt(a.name.replace(/\D/g, ''), 10);
      //     const numB = parseInt(b.name.replace(/\D/g, ''), 10);
      //     return numA - numB;
      //   });
      // } else 
      if (collection === 'careers') {
        this.careers = result;
      } 
      // else if (collection === 'faculties') {
      //   this.faculties = result;
      // } else if (collection === 'curriculums') {
      //   this.curriculums = result;
      // }
    });
  }
}
