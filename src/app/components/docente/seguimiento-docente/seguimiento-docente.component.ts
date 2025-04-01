import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
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
  searchText: string = '';
  private searchSubject = new BehaviorSubject<string>('');

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
    const activities$ = this.firestore.collection('activities', ref =>
      ref.where('emailTeacher', '==', emailDocente)
    ).valueChanges();
  
    this.actvities$ = combineLatest([activities$, this.searchSubject]).pipe(
      map(([activities, searchText]) => {
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
  
        let filteredActivities = Array.from(uniqueStudents.values());
  
        // Filtrar por el texto ingresado en la búsqueda
        if (searchText) {
          filteredActivities = filteredActivities.filter(activity =>
            activity.assistant.toLowerCase().includes(searchText.toLowerCase())
          );
        }
  
        return filteredActivities;
      })
    );
  }

  filterActivities(): void {
    this.searchSubject.next(this.searchText);
  }
  
  
}
