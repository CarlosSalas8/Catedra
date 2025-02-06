import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-revisar',
  templateUrl: './revisar.component.html',
  styleUrls: ['./revisar.component.css']
})
export class RevisarComponent implements OnInit {
  activity: any;
  selectedFile: any;
  fileUrl: string | undefined;
  isLoading: boolean = false;
  showSuccessMessage: boolean = false;
  previewUrl: SafeResourceUrl | null = null; // Solo se actualizará cuando el usuario seleccione un archivo
  files: any[] = [];  // Almacenar la lista de archivos subidos

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firestore.collection('activities').doc(id).valueChanges().subscribe((data: any) => {
        this.activity = data;
        this.loadFiles(); // Cargar archivos sin establecer una vista previa
      });
    }
  }
  // Cargar archivos de Firebase Storage sin duplicados
  loadFiles() {
    const filePath = `actividades/${this.activity.id}/`;
    this.storage.ref(filePath).listAll().subscribe(result => {
      const filePromises = result.items.map(item =>
        item.getDownloadURL().then(url => ({ name: item.name, url: url }))
      );

      Promise.all(filePromises).then(files => {
        this.files = files; // Asigna el array una sola vez después de obtener todas las URLs
      });
    });
  }


  // Seleccionar archivo para previsualizarlo
  selectFile(fileUrl: string) {
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  }

  // Eliminar archivo
  deleteFile(fileName: string) {
    const filePath = `actividades/${this.activity.id}/${fileName}`;
    const fileRef = this.storage.ref(filePath);

    fileRef.delete().subscribe(() => {
      this.files = this.files.filter(file => file.name !== fileName);

      // Si el archivo eliminado era el que se estaba previsualizando, limpiamos la vista previa
      if (this.previewUrl?.toString().includes(fileName)) {
        this.previewUrl = null;
      }
    }, error => {
      console.error("Error al eliminar el archivo:", error);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.isLoading = true;
      const filePath = `actividades/${this.activity.id}/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);

      this.storage.upload(filePath, this.selectedFile).snapshotChanges().subscribe(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.firestore.collection('activities').doc(this.activity.id).update({
            filePath: filePath,
            fileUrl: url
          }).then(() => {
            this.isLoading = false;
            this.showSuccessMessage = true;
            this.loadFiles(); // Actualizar lista de archivos
          });
        });
      });
    }
  }
}
