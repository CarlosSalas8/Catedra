import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize } from 'rxjs/operators';
import { FileData } from 'src/app/models/filedata.model';

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

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.checkExistingFiles();
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
