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
  files: any[] = [];  // Almacenar la lista de archivos subidos
  period: string = '';

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Obtener periodo
    this.firestore.collection('period', ref => ref.where("status", "==", true)).valueChanges().subscribe((data: any) => {
      this.period = data[0].name;
    })

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


  // Seleccionar archivo para abrirlo en una nueva pestaña
  selectFile(fileUrl: string) {
    window.open(fileUrl, '_blank');
  }


  // Eliminar archivo
  deleteFile(fileName: string) {
    const filePath = `actividades/${this.activity.id}/${fileName}`;
    const fileRef = this.storage.ref(filePath);

    fileRef.delete().subscribe(() => {
      this.files = this.files.filter(file => file.name !== fileName);
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