import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit {

  directors$: Observable<any[]> | undefined;
  docentes$: Observable<any[]> | undefined;
  selectedDirectorEmail: string | null = null;
  selectedDirectorName: Observable<string> = of('');

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
      this.selectedDirectorName = of('');
    } else {
      // Cargar docentes del director seleccionado
      this.selectedDirectorEmail = directorEmail;
      this.docentes$ = this.firestore.collection('teachers', ref =>
        ref.where('emailDirector', '==', directorEmail)
      ).valueChanges();

      // Obtener el nombre del director desde Firestore
      this.selectedDirectorName = this.firestore.collection('directors', ref =>
        ref.where('email', '==', directorEmail)
      ).valueChanges().pipe(
        map((directors: any[]) => (directors.length > 0 ? directors[0]['name'] : ''))
      );
    }
  }
}
