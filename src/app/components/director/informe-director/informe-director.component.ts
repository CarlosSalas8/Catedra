import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-informe-director',
  templateUrl: './informe-director.component.html',
  styleUrls: ['./informe-director.component.css']
})
export class InformeDirectorComponent {
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

  getFileName(url: string|String): string {
    const urlParts = url.split('/')
    const filePath = urlParts[urlParts.length - 1].split('?')[0]
    const fileName = filePath.split('%2F')[filePath.split('%2F').length - 1]
    return decodeURIComponent(fileName)
  }
}
