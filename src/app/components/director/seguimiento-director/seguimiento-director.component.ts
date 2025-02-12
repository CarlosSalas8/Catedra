import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-seguimiento-director',
  templateUrl: './seguimiento-director.component.html',
  styleUrls: ['./seguimiento-director.component.css']
})
export class SeguimientoDirectorComponent implements OnInit {
  docentes$: Observable<any[]> | undefined;
  directorEmail: string | null = null;

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (user && user.email) {
        this.directorEmail = user.email;
        this.cargarDocentes(user.email);
      }
    });
  }

  cargarDocentes(emailDirector: string): void {
    this.docentes$ = this.firestore
      .collection('teachers', (ref) => ref.where('emailDirector', '==', emailDirector))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data() as any;
            const id = action.payload.doc.id;
            return { ...data, id };
          })
        )
      );
  }
}
