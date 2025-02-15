import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {

  directors$: Observable<any[]> | undefined;
  docentes$: Observable<any[]> | undefined;
  selectedDirectorEmail: string | null = null;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    // Cargar lista de directores
    this.directors$ = this.firestore.collection('directors').valueChanges();
  }

  toggleDocentes(directorEmail: string) {
    if (this.selectedDirectorEmail === directorEmail) {
      // Si ya estaba seleccionado, lo ocultamos
      this.selectedDirectorEmail = null;
      this.docentes$ = undefined;
    } else {
      // Cargar docentes del director seleccionado
      this.selectedDirectorEmail = directorEmail;
      this.docentes$ = this.firestore.collection('teachers', ref =>
        ref.where('emailDirector', '==', directorEmail)
      ).valueChanges();
    }
  }
}
