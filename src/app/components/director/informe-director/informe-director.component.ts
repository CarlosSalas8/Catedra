import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-informe-director',
  templateUrl: './informe-director.component.html',
  styleUrls: ['./informe-director.component.css']
})
export class InformeDirectorComponent implements OnInit {
  usuario: any;
  estudiantes: any[] = [];
  archivosFiltrados: any[] = [];
  estudianteSeleccionado: any = null;
  archivos: any = {}; // Para almacenar las URLs de los archivos
  mostrarSelector: boolean = false;


  conflictoInteresUrl: string | undefined;
  ayudanteCatedraUrl: string | undefined;
  evaluacionBecarioUrl: string | undefined;



  constructor(private authService: AuthService, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.obtenerEstudiantes();
    this.obtenerArchivos();
  }


  obtenerEstudiantes() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const emailDirector = user.email;
        this.firestore.collection('students', ref => ref.where('emailDirector', '==', emailDirector))
          .valueChanges({ idField: 'id' })
          .subscribe(estudiantes => {
            this.estudiantes = estudiantes;
          });
      }
    });
  }

  obtenerArchivos() {
    this.firestore.collection('files').valueChanges().subscribe((data) => {
      this.archivos = data;
      this.archivosFiltrados = this.archivos.filter((archivo: { fileType: string; }) =>
        archivo.fileType === 'ayudante_catedra' || archivo.fileType === 'evaluacion_becario' || archivo.fileType === 'conflicto_interes'
      );
    });
  }

  seleccionarEstudiante(event: Event) {
    const target = event.target as HTMLSelectElement;
    const estudianteId = target.value;

    if (estudianteId) {
      this.estudianteSeleccionado = this.estudiantes.find(est => est.id === estudianteId);
      this.mostrarSelector = false;

      // Buscar en Firestore si tiene el archivo de ayudante_catedra
      this.firestore.collection('students').doc(this.estudianteSeleccionado.id).get().subscribe(doc => {
        if (doc.exists) {
          const data: any = doc.data();
          this.ayudanteCatedraUrl = data?.files?.ayudante_catedra || null;
          this.conflictoInteresUrl = data?.files?.conflicto_interes || null;
          this.evaluacionBecarioUrl = data?.files?.evaluacion_becario || null;
        }
        // Mostrar mensaje si no hay archivos
        if (!this.ayudanteCatedraUrl && !this.conflictoInteresUrl && !this.evaluacionBecarioUrl) {
          alert("Este estudiante no tiene archivos disponibles.");
        }
      });
    }
  }




  descargarArchivo(tipoArchivo: string) {
  if (!this.estudianteSeleccionado) {
    alert("Debes seleccionar un estudiante primero.");
    return;
  }

  // Verificar el tipo de archivo y descargar el correspondiente
  switch (tipoArchivo) {
    case 'ayudante_catedra':
      if (this.ayudanteCatedraUrl) {
        window.open(this.ayudanteCatedraUrl, '_blank');
      } else {
        alert("No hay archivo de Ayudante de Cátedra disponible para este estudiante.");
      }
      break;

    case 'evaluacion_becario':
      if (this.evaluacionBecarioUrl) {
        window.open(this.evaluacionBecarioUrl, '_blank');
      } else {
        alert("No hay archivo de Evaluación BRU disponible para este estudiante.");
      }
      break;

    case 'conflicto_interes':
      if (this.conflictoInteresUrl) {
        window.open(this.conflictoInteresUrl, '_blank');
      } else {
        alert("No hay archivo de Conflicto de Interés disponible para este estudiante.");
      }
      break;

    default:
      alert("Archivo desconocido.");
  }
}

  


}
