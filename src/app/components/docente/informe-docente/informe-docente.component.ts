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
  archivoSubiendo: boolean = false;
  mostrarSelector: boolean = false; // Controla la visibilidad del selector

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
            console.log("Estudiantes:", this.estudiantes);
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
    this.mostrarSelector = false; // Cierra el selector después de seleccionar
  }

  subirArchivo(event: any, tipoArchivo: string) {
    if (!this.estudianteSeleccionado) {
      alert("Por favor, selecciona un estudiante antes de subir un archivo.");
      return;
    }
  
    const archivo = event.target.files[0];
    if (!archivo) return;
  
    this.archivoSubiendo = true;
    const filePath = `students/${this.estudianteSeleccionado.id}/${tipoArchivo}/${archivo.name}`;  // Añadir el tipo de archivo en el path
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, archivo);
  
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          // Aquí se actualiza la propiedad específica dependiendo del tipo de archivo
          const updateData = {
            [`files.${tipoArchivo}`]: url  // Guarda el archivo en el campo adecuado
          };
  
          this.firestore.collection('students').doc(this.estudianteSeleccionado.id).update(updateData).then(() => {
            this.archivoSubiendo = false;
            alert('Archivo subido con éxito.');
          });
        });
      })
    ).subscribe();
  }
  
}
