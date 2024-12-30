import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'catedra';
  activities$: Observable<any[]>; // Declara una variable para almacenar los datos de la colección 'activities'

  constructor(private firestore: AngularFirestore) {
    // Obtiene una referencia a la colección 'activities' y obtiene los datos
    this.activities$ = this.firestore.collection('activities').valueChanges();
  }
}
