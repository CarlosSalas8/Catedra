import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-informe-admin',
  templateUrl: './informe-admin.component.html',
  styleUrls: ['./informe-admin.component.css']
})
export class InformeAdminComponent {
  protected user: any;
  protected postulation$: Observable<any> | undefined;
  protected postulation: any = {};
  private id: string = '';
  protected informeForm!: FormGroup;
  protected informeDocenteForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
  ) { }

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

      this.informeForm = new FormGroup({
        state: new FormControl(
          this.postulation.informe && this.postulation.informe.state /*!= "PENDIENTE"*/ ? this.postulation.informe.state : 'PENDIENTE',
          [Validators.required]
        ),
        comment: new FormControl(
          this.postulation.informe && this.postulation.informe.comment ? this.postulation.informe.comment : ''
        )
      });
  
      this.informeDocenteForm = new FormGroup({
        state: new FormControl(
          this.postulation.informeDocente && this.postulation.informeDocente.state /*!= "PENDIENTE"*/ ? this.postulation.informeDocente.state : 'PENDIENTE', [Validators.required]
        ),
        comment: new FormControl(
          this.postulation.informeDocente && this.postulation.informeDocente.comment ? this.postulation.informeDocente.comment : ''
        )
      });
    });
  }

  getFileName(url: string|String): string {
    const urlParts = url.split('/')
    const filePath = urlParts[urlParts.length - 1].split('?')[0]
    const fileName = filePath.split('%2F')[filePath.split('%2F').length - 1]
    return decodeURIComponent(fileName)
  }

  uploadInforme(): void {
    if (this.informeForm.valid) {
      this.firestore.collection('postulant').doc(this.id).update({
        informe: {
          ...this.postulation.informe,
          state: this.informeForm.value.state,
          comment: this.informeForm.value.comment
        }
      }).then(() => {
        console.log('Informe guardado');
      });
    }
  }

  uploadInformeDocente(): void {
    if (this.informeDocenteForm.valid) {
      this.firestore.collection('postulant').doc(this.id).update({
        informeDocente: {
          ...this.postulation.informeDocente,
          state: this.informeDocenteForm.value.state,
          comment: this.informeDocenteForm.value.comment
        }
      }).then(() => {
        console.log('Informe guardado');
      });
    }
  }
}