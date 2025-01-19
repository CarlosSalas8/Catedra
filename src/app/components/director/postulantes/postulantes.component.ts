import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-postulantes',
  templateUrl: './postulantes.component.html',
  styleUrls: ['./postulantes.component.css']
})
export class PostulantesComponent implements OnInit {

  postulant$: Observable<any[]>; // Declara una variable para los datos
  postulant: any[] = [];
  plaza: any | null = null;
  plazaID: string | null = null; // ID de la plaza seleccionada

  isSaving: { [key: string]: boolean } = {}; // Indica si se están guardando los datos
  saveMessage: string = ''; // Mensaje de estado para mostrar al usuario

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { 
     // Suscríbete a los cambios en la colección
  this.postulant$ = this.firestore.collection('postulant').valueChanges({ idField: 'id' });
  }

  ngOnInit(): void {

    // Capturar el ID de la plaza desde la ruta
    this.plazaID = this.route.snapshot.paramMap.get('id');

    if (this.plazaID) {
      // Obtener los datos de las plazas y filtrar por el ID de la plaza
      this.authService.getPlazas().subscribe((plazas) => {
        this.plaza = plazas.find((plaza: any) => plaza.id === this.plazaID);
        this.postulant = this.plaza ? this.plaza.postulant : [];
      });
    }


  }

  // Método para validar o no validar a un postulante y actualizar en 'users'
  validatePostulant(isValid: boolean, postulanteId: string): void {
    if (postulanteId) {
      // Obtener la referencia de la colección 'postulant' y consultar el documento
      this.firestore.collection('postulant').doc(postulanteId).get().toPromise().then((postulantDoc) => {
        if (postulantDoc && postulantDoc.exists) {
          // Extraer el userID del documento del postulante
          const postulantData = postulantDoc.data() as { usuario?: { userID?: string } };
          const userId = postulantData.usuario?.userID;

          // Actualizar el campo 'validated' en la colección 'postulant'
          this.firestore.collection('postulant').doc(postulanteId).update({
            validated: isValid
          }).then(() => {
            console.log(`Postulante ${isValid ? 'aceptado' : 'rechazado'}`);
          }).catch(error => {
            console.error('Error al actualizar la validación del postulante:', error);
          });

          // Actualizar el campo 'validated' en la colección 'users' si userID existe
          if (userId) {
            this.firestore.collection('users').doc(userId).update({
              validated: isValid
            }).then(() => {
              console.log(`Usuario ${isValid ? 'validado' : 'no validado'} en la colección 'users'`);
            }).catch(error => {
              console.error('Error al actualizar la validación del usuario:', error);
            });
          } else {
            console.warn('El ID del usuario no se encontró en el documento del postulante.');
          }
        } else {
          console.error('El documento del postulante no existe.');
        }
      }).catch(error => {
        console.error('Error al obtener el documento del postulante:', error);
      });
    }
  }




  solicitarEntrevista(postulante: any): void {
    // Lógica para solicitar entrevista (ejemplo: mostrar mensaje o guardar en la base de datos)
    console.log(`Entrevista solicitada para ${postulante.usuario?.name}`);
  }

  aceptarPostulante(postulante: any): void {
    // Lógica para aceptar al postulante (ejemplo: actualizar estado en la base de datos)
    console.log(`Postulante aceptado: ${postulante.usuario?.name}`);
  }

  rechazarPostulante(postulante: any): void {
    // Lógica para rechazar al postulante (ejemplo: actualizar estado en la base de datos)
    console.log(`Postulante rechazado: ${postulante.usuario?.name}`);
  }

  guardarCambios(postulante: any): void {
    if (this.plazaID) {
      this.isSaving[postulante.id] = true; // Inicia la animación de guardado
      this.saveMessage = 'Guardando cambios...'; // Mensaje inicial

      const updatedPostulante = {
        ...postulante,
        qualificationCycle: postulante.qualificationCycle || null,
        qualificationMirror: postulante.qualificationMirror || null,
      };

      // Actualizar solo el postulante correspondiente en la colección de plazas
      this.firestore.collection('plazas').doc(this.plazaID).update({
        postulant: this.postulant // Si es necesario, puedes modificar el array 'postulant' para reflejar solo los cambios de este postulante
      }).then(() => {
        // Actualizar solo el postulante en la colección de postulantes
        this.firestore.collection('postulant').doc(postulante.id).update({
          qualificationCycle: updatedPostulante.qualificationCycle,
          qualificationMirror: updatedPostulante.qualificationMirror
        }).then(() => {
          this.isSaving[postulante.id] = false; // Detener la animación de guardado
          this.saveMessage = 'Cambios guardados exitosamente.'; // Mensaje de éxito

          // Ocultar mensaje después de unos segundos
          setTimeout(() => {
            this.saveMessage = '';
          }, 3000);
        });
      }).catch(error => {
        this.isSaving[postulante.id] = false; // Detener la animación
        this.saveMessage = 'Error al guardar los cambios.'; // Mostrar mensaje de error
        console.error(error);
      });
    }
  }



}