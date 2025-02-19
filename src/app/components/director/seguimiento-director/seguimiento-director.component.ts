import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-seguimiento-director',
  templateUrl: './seguimiento-director.component.html',
  styleUrls: ['./seguimiento-director.component.css']
})
export class SeguimientoDirectorComponent implements OnInit {

  docentes$: Observable<any[]> | undefined;
  estudiantes$: Observable<any[]> | undefined;
  activities$: Observable<any[]> | undefined;
  activityDetails$: Observable<any> | undefined;
  files: any[] = [];
  selectedDocenteEmail: string | null = null;
  selectedDocenteName: Observable<string> = of('');
  selectedEstudianteEmail: string | null = null;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.docentes$ = this.firestore.collection('teachers').valueChanges();
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