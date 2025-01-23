import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  plazas$: Observable<any[]> | undefined;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {

    // Obtiene plazas y asocia el ID de teacher por nombre
    this.plazas$ = this.firestore.collection('plazas').valueChanges().pipe(
      map((plazas: any[]) =>
        plazas.map(plaza => ({
          ...plaza,
          teacherId$: this.firestore.collection('teachers', ref =>
            ref.where('email', '==', plaza.emailTeacher)
          ).valueChanges().pipe(
            map((teachers: any[]) => teachers.length ? teachers[0].id : null) // Toma el ID del docente
          )
        }))
      )
    );


  }
}
