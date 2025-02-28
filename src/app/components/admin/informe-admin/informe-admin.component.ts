import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { FileData } from 'src/app/models/filedata.model';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informe-admin',
  templateUrl: './informe-admin.component.html',
  styleUrls: ['./informe-admin.component.css']
})
export class InformeAdminComponent implements OnInit {

  @ViewChild('fileAyudante', { static: false }) fileAyudante!: ElementRef;
  @ViewChild('fileEvaluacionBecario', { static: false }) fileEvaluacionBecario!: ElementRef;
  @ViewChild('fileConflictoInteres', { static: false }) fileConflictoInteres!: ElementRef;

  uploadStatus: { [key: string]: { loading: boolean, success: boolean, message: string, existingFile: boolean } } = {
    'ayudante_catedra': { loading: false, success: false, message: '', existingFile: false },
    'evaluacion_becario': { loading: false, success: false, message: '', existingFile: false },
    'conflicto_interes': { loading: false, success: false, message: '', existingFile: false }
  };

  fileData: { [key: string]: { url: string, date: string, name: string } } = {
    'ayudante_catedra': { url: '', date: '', name: '' },
    'evaluacion_becario': { url: '', date: '', name: '' },
    'conflicto_interes': { url: '', date: '', name: '' }
  };

  estudiantes: any[] = [];
  archivos: any = {};
  archivosFiltrados: any[] = [];
  estudianteSeleccionado: any = null;
  mostrarSelector: boolean = false;

  conflictoInteresUrl: string | undefined;
  ayudanteCatedraUrl: string | undefined;
  evaluacionBecarioUrl: string | undefined;



  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, private authService: AuthService) { }

  ngOnInit() {
    this.checkExistingFiles();
    this.obtenerEstudiantes();
    this.obtenerArchivos();
  }

  obtenerEstudiantes() {
    this.firestore.collection('students')
      .valueChanges({ idField: 'id' })
      .subscribe(estudiantes => {
        this.estudiantes = estudiantes;
      });
  }

  validatefiles(isValid: boolean, fileType: string): void {
    if (!this.estudianteSeleccionado) {
      alert("Debes seleccionar un estudiante antes de validar.");
      return;
    }
  
    const studentId = this.estudianteSeleccionado.id;
    const updateData: { validated?: boolean, validated2?: boolean } = {};
  
    // Actualiza según el tipo de archivo
    if (fileType === 'ayudante_catedra') {
      updateData['validated'] = isValid;
    } else if (fileType === 'evaluacion_becario' || fileType === 'conflicto_interes') {
      updateData['validated2'] = isValid;
    }
  
    this.firestore.collection('students').doc(studentId).update(updateData).then(() => {
      alert("Acción realizada con éxito.");
  
      // Actualizar el estado local del estudiante seleccionado
      if (fileType === 'ayudante_catedra') {
        this.estudianteSeleccionado['validated'] = isValid;
      } else {
        this.estudianteSeleccionado['validated2'] = isValid;
      }
  
      // También actualizamos la lista de estudiantes para reflejar el cambio
      const index = this.estudiantes.findIndex(est => est.id === studentId);
      if (index !== -1) {
        if (fileType === 'ayudante_catedra') {
          this.estudiantes[index]['validated'] = isValid;
        } else {
          this.estudiantes[index]['validated2'] = isValid;
        }
      }
    }).catch(() => {
      alert("Ocurrió un error al actualizar la validación.");
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
  
      this.firestore.collection('students').doc(estudianteId).get().subscribe(doc => {
        if (doc.exists) {
          const data: any = doc.data();
          this.ayudanteCatedraUrl = data?.files?.ayudante_catedra || null;
          this.conflictoInteresUrl = data?.files?.conflicto_interes || null;
          this.evaluacionBecarioUrl = data?.files?.evaluacion_becario || null;
  
          // Actualizar la validación sin perder la referencia del objeto
          this.estudianteSeleccionado.validated = data?.validated !== undefined;
  
          // Mantener la selección en el select
          setTimeout(() => {
            target.value = estudianteId;
          });
        }
  
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

  checkExistingFiles() {
    this.firestore.collection('files').get().subscribe(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data() as any;
        if (this.uploadStatus[data.fileType]) {
          this.uploadStatus[data.fileType].existingFile = true;
          this.uploadStatus[data.fileType].message = 'Formato cargado';
          this.fileData[data.fileType] = {
            url: data.url,
            date: new Date(data.timestamp.seconds * 1000).toLocaleDateString(),
            name: data.name || 'Archivo cargado' // Si no hay nombre, mostrar un mensaje por defecto
          };
        }
      });
    });
  }

  uploadFile(event: any, fileType: string) {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Solo se permiten archivos en formato PDF');
      return;
    }

    if (this.uploadStatus[fileType].existingFile) {
      const confirmReplace = confirm('Ya existe un archivo cargado. ¿Deseas reemplazarlo?');
      if (!confirmReplace) return;

      this.deleteExistingFile(fileType);
    }

    this.uploadStatus[fileType].loading = true;
    this.uploadStatus[fileType].success = false;
    this.uploadStatus[fileType].message = 'Cargando archivo...';

    const filePath = `files/${fileType}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          const timestamp = new Date();
          this.firestore.collection('files').add({
            fileType: fileType,
            url: url,
            name: file.name,  // Guardamos el nombre en Firestore
            timestamp: timestamp
          }).then(() => {
            this.uploadStatus[fileType].loading = false;
            this.uploadStatus[fileType].success = true;
            this.uploadStatus[fileType].message = 'Archivo cargado con éxito';
            this.uploadStatus[fileType].existingFile = true;
            this.fileData[fileType] = {
              url: url,
              date: timestamp.toLocaleDateString(),
              name: file.name  // Guardamos el nombre en la variable fileData
            };
          });
        });
      })
    ).subscribe();
  }

  deleteExistingFile(fileType: string) {
    this.firestore.collection('files', ref => ref.where('fileType', '==', fileType))
      .get().subscribe(snapshot => {
        snapshot.forEach(doc => {
          const data = doc.data() as FileData;
          const fileUrl = data.url;
          const filePath = decodeURIComponent(fileUrl.split('/o/')[1].split('?')[0]);

          this.firestore.collection('files').doc(doc.id).delete();
          this.storage.ref(filePath).delete().subscribe();
        });
      });
  }

  triggerFileInput(inputType: string) {
    switch (inputType) {
      case 'ayudantecatedra':
        this.fileAyudante.nativeElement.click();
        break;
      case 'evaluacionbecario':
        this.fileEvaluacionBecario.nativeElement.click();
        break;
      case 'conflictointeres':
        this.fileConflictoInteres.nativeElement.click();
        break;
    }
  }


}
