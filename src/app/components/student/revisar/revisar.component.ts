import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-revisar',
  templateUrl: './revisar.component.html',
  styleUrls: ['./revisar.component.css']
})
export class RevisarComponent implements OnInit {
  activity: any;
  selectedFile: any;
  fileUrl: string | undefined;
  previewUrl: string | undefined;
  isLoading: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firestore.collection('activities').doc(id).valueChanges().subscribe(data => {
        this.activity = data;
      });
    }

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.isLoading = true; // Establecer el estado de carga a true
      const filePath = `actividades/${this.activity.id}/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedFile).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log('File uploaded successfully:', url);
            this.fileUrl = url;
            this.isLoading = false; // Establecer el estado de carga a false después de la subida
            this.showSuccessMessage = true; // Mostrar el mensaje de éxito
          });
        })
      ).subscribe();
    }
  }




}
