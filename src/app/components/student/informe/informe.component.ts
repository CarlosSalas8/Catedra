import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth.service';
import { Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {
  protected user: any;
  protected postulation$: Observable<any> | undefined;
  protected postulation: any = {};
  private id: string = '';

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async ngOnInit(): Promise<void> {
    // Obtener el usuario logueado
    this.user = await this.authService.getCurrentUser5();

    // Obtener la plaza del usuario
    this.postulation$ = await this.firestore.collection('postulant', ref => {
      return ref.where('userID', '==', this.user.userID)
                .where('validated', '==', true);
    }).valueChanges();

    this.postulation$.subscribe((postulation: any) => {
      this.id = postulation[0].id;
      this.postulation = postulation[0];
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const filePath = `informes/${this.user.uid}/${this.postulation.plazaID}/${file.name}`;
    const task = this.storage.upload(filePath, file);

    task.then(() => {
      // Obtener la URL del archivo subido
      const fileRef = this.storage.ref(filePath);
      fileRef.getDownloadURL().subscribe(url => {
        console.log('URL del archivo subido:', url);

        // Guardar la URL del archivo en la base de datos
        this.firestore.collection('postulant').doc(this.id).update({
          informe: {
            url: url,
            name: file.name,
            state: "PENDIENTE",
            date: Timestamp.now()
          }
        }).then(() => {
          console.log('URL del archivo guardada en la base de datos');
        });
      });

      

      console.log('Archivo subido correctamente');
    }).catch(error => {
      console.error('Error al subir el archivo:', error);
    });
  }

  getFileName(url: string|String): string {
    const urlParts = url.split('/')
    const filePath = urlParts[urlParts.length - 1].split('?')[0]
    const fileName = filePath.split('%2F')[filePath.split('%2F').length - 1]
    return decodeURIComponent(fileName)
  }
}