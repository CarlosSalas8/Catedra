import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-informe-docente',
  templateUrl: './informe-docente.component.html',
  styleUrls: ['./informe-docente.component.css']
})
export class InformeDocenteComponent {
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

    // Obtener el id de la postulation del usuario de la url
    const urlParts = window.location.pathname.split('/');
    const ID = urlParts[urlParts.length - 1];

    // Obtener la postulation del usuario
    this.postulation$ = await this.firestore.collection('postulant').doc(ID).valueChanges();
    
    this.postulation$.subscribe((postulation: any) => {
      console.log(postulation);
      
      this.id = postulation.id;
      this.postulation = postulation;
    });
  }

  onFileSelected(event: any, type: "Eval" | "Decl"): void {
    const file = event.target.files[0];
    const typeUrl = type === "Eval" ? "evaluacion" : "declaratoria";
    const filePath = `${typeUrl}/${this.user.uid}/${this.postulation.plazaID}/${file.name}`;
    const task = this.storage.upload(filePath, file);

    task.then(() => {
      // Obtener la URL del archivo subido
      const fileRef = this.storage.ref(filePath);
      fileRef.getDownloadURL().subscribe(url => {
        console.log('URL del archivo subido:', url);

        if (!this.postulation.informeDocente) {
          this.postulation.informeDocente = {};
        } 
  
        if (this.postulation.informeDocente.state === "VALIDADO") {
          console.log('El informe ya fue enviado');
          return;
        }
  
        // Guardar la URL del archivo en la base de datos
        this.firestore.collection('postulant').doc(this.id).update({
          informeDocente: {
            evaluacion: type === "Eval" ? {
              url: url,
              name: file.name,
              date: Timestamp.now()
            } : this.postulation.informeDocente.evaluacion ? this.postulation.informeDocente.evaluacion : null,
            declaratoria: type === "Decl" ? {
              url: url,
              name: file.name,
              date: Timestamp.now()
            } : this.postulation.informeDocente.declaratoria ? this.postulation.informeDocente.declaratoria : null,
            state: "PENDIENTE",
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