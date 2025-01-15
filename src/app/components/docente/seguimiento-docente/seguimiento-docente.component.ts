import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-seguimiento-docente',
  templateUrl: './seguimiento-docente.component.html',
  styleUrls: ['./seguimiento-docente.component.css']
})
export class SeguimientoDocenteComponent implements OnInit {

  plazas$: Observable<any[]> | undefined;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {

    // Obtiene plazas y asocia el ID de teacher por nombre
    this.plazas$ = this.firestore.collection('plazas').valueChanges().pipe(
      map((plazas: any[]) =>
        plazas.map(plaza => ({
          ...plaza,
          teacherId$: this.firestore.collection('teachers', ref =>
            ref.where('name', '==', plaza.nameTeacher)
          ).valueChanges().pipe(
            map((teachers: any[]) => teachers.length ? teachers[0].id : null) // Toma el ID del docente
          )
        }))
      )
    );


  }

}