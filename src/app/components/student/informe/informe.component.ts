import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs/operators';

interface Estudiante {
  id: string;
  emailAssistant: string;
  files?: {
    ayudante_catedra?: string;
    conflicto_interes?: string;
    evaluacion_becario?: string;
  };
}

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  archivos: any[] = [];
  userEmail: string | null = null;
  archivosFiltrados: any[] = [];
  estudianteId: string | null = null;

  archivoSubiendo: boolean = false;
  mensajeExito: boolean = false;
  archivoExistente: boolean = false;

  conflictoInteresUrl: string | undefined;
  evaluacionBecarioUrl: string | undefined;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.obtenerArchivos();
    this.obtenerUsuario();
    this.obtenerArchivosEstudiantes();
  }

  obtenerUsuario() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        this.buscarEstudiantePorEmail();
      }
    });
  }

  buscarEstudiantePorEmail() {
    if (!this.userEmail) return;

    this.firestore.collection<Estudiante>('students', ref => ref.where('emailAssistant', '==', this.userEmail))
      .valueChanges({ idField: 'id' })
      .subscribe(estudiantes => {
        if (estudiantes.length > 0) {
          this.estudianteId = estudiantes[0].id;
          this.verificarArchivoExistente();
        }
      });
  }

  verificarArchivoExistente() {
    if (!this.estudianteId) return;
  
    this.firestore.collection('students').doc(this.estudianteId).get().subscribe((doc) => {
      if (doc.exists) {
        const data = doc.data() as Estudiante;
        this.archivoExistente = !!data.files?.ayudante_catedra;
      }
    });
  }

  obtenerArchivosEstudiantes() {
    // Obtener el email del usuario logueado
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        const emailLoggedIn = user.email;
        // Obtener el documento del estudiante usando su correo electrónico
        this.firestore.collection<Estudiante>('students', ref => ref.where('emailAssistant', '==', emailLoggedIn))
          .valueChanges({ idField: 'id' })
          .subscribe(estudiantes => {
            estudiantes.forEach(estudiante => {
              if (estudiante.files) {
                this.conflictoInteresUrl = estudiante.files.conflicto_interes;
                this.evaluacionBecarioUrl = estudiante.files.evaluacion_becario;
              }
            });
          });
      }
    });
  }
  

  obtenerArchivos() {
    this.firestore.collection('files').valueChanges().subscribe((data) => {
      this.archivos = data;
      this.archivosFiltrados = this.archivos.filter(archivo =>
        archivo.fileType === 'ayudante_catedra'
      );
    });
  }

  subirArchivo(event: any) {
    if (!this.estudianteId) {
      alert("No se encontró un estudiante con este correo.");
      return;
    }
  
    const archivo = event.target.files[0];
    if (!archivo) return;
  
    this.archivoSubiendo = true;
    this.mensajeExito = false;
  
    const filePath = `students/${this.estudianteId}/ayudante_catedra/${archivo.name}`;
    const fileRef = this.storage.ref(filePath);
  
    // Verificar si ya existe un archivo y eliminarlo
    if (this.conflictoInteresUrl) {
      const oldFileRef = this.storage.refFromURL(this.conflictoInteresUrl);
      oldFileRef.delete().toPromise().then(() => {
        console.log("Archivo anterior eliminado");
        this.uploadNuevoArchivo(filePath, archivo);
      }).catch((error) => {
        console.error("Error al eliminar archivo anterior:", error);
        this.uploadNuevoArchivo(filePath, archivo);  // Si no hay archivo anterior, continuar con la carga
      });
    } else {
      this.uploadNuevoArchivo(filePath, archivo);
    }
  }
  
  uploadNuevoArchivo(filePath: string, archivo: any) {
    const uploadTask = this.storage.upload(filePath, archivo);
  
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.storage.ref(filePath).getDownloadURL().subscribe((url) => {
          const updateData = {
            [`files.ayudante_catedra`]: url
          };
  
          this.firestore.collection('students').doc(this.estudianteId as string).update(updateData)
            .then(() => {
              this.archivoSubiendo = false;
              this.mensajeExito = true;
              this.archivoExistente = true;
            })
            .catch(error => {
              console.error("Error al guardar en Firestore:", error);
              this.archivoSubiendo = false;
            });
        });
      })
    ).subscribe();
  }
  
}
