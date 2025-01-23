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

  plazas$: Observable<any[]> | undefined;

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  ngOnInit(): void {
    // Obtiene el usuario autenticado
    this.authService.getCurrentUser().subscribe(currentUser => {
      if (currentUser?.email) {
        this.plazas$ = this.firestore.collection('plazas', ref =>
          ref.where('emailTeacher', '==', currentUser.email)
        ).valueChanges().pipe(
          map(plazas => plazas.map(plaza => {
            if (typeof plaza === 'object' && plaza !== null) {
              return {
                ...plaza,
                teacherId$: this.firestore.collection('teachers', ref =>
                  ref.where('email', '==', currentUser.email)
                ).valueChanges().pipe(
                  map((teachers: any[]) => teachers.length ? teachers[0].id : null)
                )
              };
            } else {
              console.error('Plaza is not an object:', plaza);
              return plaza;
            }
          }))
        );
      } else {
        console.error('No hay un usuario autenticado.');
      }
    });
  }

}