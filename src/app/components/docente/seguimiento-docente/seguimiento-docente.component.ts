import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seguimiento-docente',
  templateUrl: './seguimiento-docente.component.html',
  styleUrls: ['./seguimiento-docente.component.css']
})
export class SeguimientoDocenteComponent implements OnInit {

  actvities$: Observable<any[]> | undefined;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
    this.actvities$ = this.firestore.collection('activities', ref =>
      ref.where('emailTeacher', '==', emailDocente)
    ).valueChanges().pipe(
      map(activities => {
        const uniqueStudents = new Map();
        activities.forEach(activity => {
          const typedActivity = activity as { assistant: string };
          if (!uniqueStudents.has(typedActivity.assistant)) {
            uniqueStudents.set((activity as any).assistant, {
              ...(typeof activity === 'object' && activity !== null ? activity : {}),
              teacherId$: this.firestore.collection('teachers', ref =>
                ref.where('email', '==', emailDocente)
              ).valueChanges().pipe(
                map((teachers: any[]) => teachers.length ? teachers[0].id : null)
              )
            });
          }
        });
        return Array.from(uniqueStudents.values());
      })
    );
  }
}
