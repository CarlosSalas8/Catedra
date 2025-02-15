import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-ver-informe',
  templateUrl: './ver-informe.component.html',
  styleUrls: ['./ver-informe.component.css']
})
export class VerInformeComponent implements OnInit {

  reportData: any | null = null;

  constructor(private firestore: AngularFirestore, public periodoService: PeriodoService) { }

  ngOnInit(): void {
    // Aquí cargamos los datos desde Firebase
    this.cargarDatos();    
  }

  cargarDatos(): void {
    this.firestore.collection('report', ref => ref.limit(1).orderBy('periodID', 'desc')).get().subscribe(snapshot => {
      if (!snapshot.empty) {
        this.reportData = snapshot.docs[0].data();
       
      } else {
        console.error('No se encontraron datos.');
      }
    });
  }


 

}
