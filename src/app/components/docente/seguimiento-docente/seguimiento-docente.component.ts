import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-seguimiento-docente',
  templateUrl: './seguimiento-docente.component.html',
  styleUrls: ['./seguimiento-docente.component.css']
})
export class SeguimientoDocenteComponent implements OnInit {

  actvities$: Observable<any[]> | undefined;

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  ngOnInit(): void {
    // Obtiene el usuario autenticado
    this.authService.getCurrentUser().subscribe(currentUser => {
      if (currentUser?.email) {
        this.actvities$ = this.firestore.collection('activities', ref =>
          ref.where('emailTeacher', '==', currentUser.email)
        ).valueChanges().pipe(
          map(activities => {
            const uniqueStudents = new Map();
            activities.forEach(activity => {
              const typedActivity = activity as { assistant: string };
              if (!uniqueStudents.has(typedActivity.assistant)) {
                uniqueStudents.set((activity as any).assistant, {
                  ...(typeof activity === 'object' && activity !== null ? activity : {}),
                  teacherId$: this.firestore.collection('teachers', ref =>
                    ref.where('email', '==', currentUser.email)
                  ).valueChanges().pipe(
                    map((teachers: any[]) => teachers.length ? teachers[0].id : null)
                  )
                });
              }
            });
            return Array.from(uniqueStudents.values());
          })
        );
      } else {
        console.error('No hay un usuario autenticado.');
      }
    });
  }
  

}