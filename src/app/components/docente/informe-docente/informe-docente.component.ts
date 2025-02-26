import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-informe-docente',
  templateUrl: './informe-docente.component.html',
  styleUrls: ['./informe-docente.component.css']
})
export class InformeDocenteComponent implements OnInit {
  archivos: any[] = [];
  archivosFiltrados: any[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit() {
    this.obtenerArchivos();
  }

  obtenerArchivos() {
    this.firestore.collection('files').valueChanges().subscribe((data) => {
      this.archivos = data;
      // Filtrar los archivos para que solo incluya los de tipo 'conflicto_interes' y 'ayudante_catedra'
      this.archivosFiltrados = this.archivos.filter(archivo => 
        archivo.fileType === 'evaluacion_becario' || archivo.fileType === 'conflicto_interes'
      );
    });
  }
}
