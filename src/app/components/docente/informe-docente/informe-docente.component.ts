import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-informe-docente',
  templateUrl: './informe-docente.component.html',
  styleUrls: ['./informe-docente.component.css']
})
export class InformeDocenteComponent implements OnInit {
  archivos: any[] = [];
  archivosFiltrados: any[] = [];
  estudiantes: any[] = [];
  estudianteSeleccionado: any = null;
  estudianteSeleccionado2: any = null;

  archivoSubiendoEvaluacion: boolean = false;
  archivoSubiendoConflicto: boolean = false;
  mensajeExitoEvaluacion: boolean = false;
  mensajeExitoConflicto: boolean = false;

  mostrarSelector: boolean = false;

  ayudanteCatedraUrl: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.obtenerEstudiantes();
    this.obtenerArchivos();
  }

  obtenerEstudiantes() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const emailTeacher = user.email;
        this.firestore.collection('students', ref => ref.where('emailTeacher', '==', emailTeacher))
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
      this.archivosFiltrados = this.archivos.filter(archivo =>
        archivo.fileType === 'evaluacion_becario' || archivo.fileType === 'conflicto_interes'
      );
    });
  }

  toggleSelector() {
    this.mostrarSelector = !this.mostrarSelector;
  }

  seleccionarEstudiante(estudiante: any) {
    this.estudianteSeleccionado = estudiante;
    this.mostrarSelector = false;
  }

  seleccionarEstudiante2(estudiante: any) {
    this.estudianteSeleccionado2 = estudiante;
    this.mostrarSelector = false;

    // Buscar en Firestore si tiene el archivo de ayudante_catedra
    this.firestore.collection('students').doc(estudiante.id).get().subscribe(doc => {
      if (doc.exists) {
        const data: any = doc.data();
        this.ayudanteCatedraUrl = data?.files?.ayudante_catedra || null;
      }
    });
  }

  descargarAyudanteCatedra() {
    if (!this.estudianteSeleccionado2) {
      alert("Debes seleccionar un estudiante primero.");
      return;
    }
    if (this.ayudanteCatedraUrl) {
      window.open(this.ayudanteCatedraUrl, '_blank');
    } else {
      alert("No hay un archivo de Ayudante de Cátedra disponible para este estudiante.");
    }
  }

  subirArchivo(event: any, tipoArchivo: string) {
    if (!this.estudianteSeleccionado) {
      alert("Por favor, selecciona un estudiante antes de subir un archivo.");
      return;
    }

    const archivo = event.target.files[0];
    if (!archivo) return;

    if (tipoArchivo === 'evaluacion_becario') {
      this.archivoSubiendoEvaluacion = true;
      this.mensajeExitoEvaluacion = false;
    } else {
      this.archivoSubiendoConflicto = true;
      this.mensajeExitoConflicto = false;
    }

    const filePath = `students/${this.estudianteSeleccionado.id}/${tipoArchivo}/${archivo.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, archivo);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          const updateData = {
            [`files.${tipoArchivo}`]: url
          };

          this.firestore.collection('students').doc(this.estudianteSeleccionado.id).update(updateData).then(() => {
            if (tipoArchivo === 'evaluacion_becario') {
              this.archivoSubiendoEvaluacion = false;
              this.mensajeExitoEvaluacion = true;
            } else {
              this.archivoSubiendoConflicto = false;
              this.mensajeExitoConflicto = true;
            }
          });
        });
      })
    ).subscribe();
  }
}
