import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-seguimiento-director',
  templateUrl: './seguimiento-director.component.html',
  styleUrls: ['./seguimiento-director.component.css']
})
export class SeguimientoDirectorComponent implements OnInit {


  allDocentes: any[] = [];

  searchTerm: string = '';

  docentes$: Observable<any[]> | undefined;
  estudiantes$: Observable<any[]> | undefined;
  activities$: Observable<any[]> | undefined;
  activityDetails$: Observable<any> | undefined;
  files: any[] = [];
  selectedDocenteEmail: string | null = null;
  selectedDocenteName: Observable<string> = of('');
  selectedEstudianteEmail: string | null = null;
  selectedEstudianteName: string = '';

  selectedCareer: string = '';
  order: 'asc' | 'desc' = 'asc';	

  careers: any[] = [];
  user: any;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.fetchData('careers');
    this.docentes$ = this.firestore.collection('teachers').valueChanges();
    
    this.user = await this.authService.getCurrentUser5();

    this.filterByCareer();
    // this.asignarCarreraFacultad();
    // this.asignarCarreraFacultadUsuarios();
  }

  // Filtro por carrera 
  filterByCareer() {
    this.docentes$ = this.firestore.collection('teachers', ref => {
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

  sortDocentes() {
    this.filterByCareer();
  }

  // Función que Asigna la carrera, facultad a los teachers desde los directores
  asignarCarreraFacultad() {
    this.firestore.collection('teachers').get().subscribe((teachers) => {
      teachers.docs.forEach((teacher) => {
        const data: any = teacher.data();
        this.firestore.collection('directors', ref => ref.where('email', '==', data.emailDirector)).get().subscribe((directors) => {
          directors.docs.forEach((director) => {
            const directorData: any = director.data();
            if (directorData.career === undefined || directorData.faculty === undefined) {
              return;
            }
            this.firestore.collection('teachers').doc(teacher.id).update({
              career: directorData.career,
              careerId: directorData.careerId,
              faculty: directorData.faculty,
              facultyId: directorData.facultyId
            });
          });
        });
      });
    });
  }

  // Función que asigna la carrera, facultad a los usuarios de los directores
  asignarCarreraFacultadUsuarios() {
    this.firestore.collection('users').get().subscribe((users) => {
      users.docs.forEach((user) => {
        const data: any = user.data();
        this.firestore.collection('directors', ref => ref.where('email', '==', data.email)).get().subscribe((directors) => {
          directors.docs.forEach((director) => {
            const directorData: any = director.data();
            if (directorData.career === undefined || directorData.faculty === undefined) {
              return;
            }
            this.firestore.collection('users').doc(user.id).update({
              career: directorData.career,
              careerId: directorData.careerId,
              faculty: directorData.faculty,
              facultyId: directorData.facultyId
            });
          });
        });
      });
    });
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


  // Función para cerrar todo cuando se cambia de sección
  cerrarTodo() {
    this.docentes$ = undefined;

    this.selectedDocenteEmail = null;
    this.estudiantes$ = undefined;

    this.selectedEstudianteEmail = null;
    this.activities$ = undefined;
    this.activityDetails$ = undefined;
    this.files = [];
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
      this.estudiantes$ = this.firestore.collection('plazas', ref =>
        ref.where('emailTeacher', '==', docenteEmail)
      ).valueChanges()
      // .pipe(
      //   map((activities: any[]) => {
      //     const uniqueStudents = new Map();
      //     activities.forEach(activity => {
      //       if (!uniqueStudents.has(activity.assistant)) {
      //         uniqueStudents.set(activity.assistant, activity);
      //       }
      //     });
      //     return Array.from(uniqueStudents.values());
      //   })
      // );
      .pipe(
        map((plazas: any[]) => {
          const uniqueStudents = new Map();
          plazas.forEach(plaza => {
            plaza.postulant.forEach((postulant: any) => {
              let student = postulant.usuario;

              student.parallel = plaza.parallel;
              student.subject = plaza.subject;
              student.emailTeacher = plaza.emailTeacher;
              student.id = plaza.id;
              student.faculty = plaza.faculty;
              student.curriculum = plaza.curriculum;
              student.plazaID = plaza.id;
              
              if (!uniqueStudents.has(postulant.email)) {

                uniqueStudents.set(postulant.usuario.name, postulant.usuario);
              }
            });
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

  toggleActividades(estudianteEmail: string, estudianteName: string) {
    if (this.selectedEstudianteEmail === estudianteEmail) {
      this.selectedEstudianteEmail = null;
      this.activities$ = undefined;
      this.activityDetails$ = undefined;
    } else {
      this.selectedEstudianteEmail = estudianteEmail;
      this.selectedEstudianteName = estudianteName;
      this.activities$ = this.firestore.collection('activities', ref =>
        ref.where('emailAssistant', '==', estudianteEmail)
      ).valueChanges();
    }
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
}