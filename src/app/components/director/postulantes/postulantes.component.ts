import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LogIn } from 'lucide-angular';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-postulantes',
  templateUrl: './postulantes.component.html',
  styleUrls: ['./postulantes.component.css']
})
export class PostulantesComponent implements OnInit {

  postulant: any[] = [];
  plaza: any | null = null;
  plazaID: string | null = null; // ID de la plaza seleccionada

  activitys: any[] = [];
  activePeriod: any | null = null;
  usuario: any = null;
  role: string | null = null;


  isSaving: { [key: string]: boolean } = {}; // Indica si se están guardando los datos
  saveMessage: string = ''; // Mensaje de estado para mostrar al usuario

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private route: ActivatedRoute,
    public periodoService: PeriodoService
  ) {

  }

  cargarActividadesPorEstudiante(assistant: string): void {
    this.firestore.collection('activities', ref =>
      ref.where('assistant', '==', assistant) // Ahora assistant tiene el nombre correcto
    ).valueChanges().subscribe(data => {   
      this.activitys = data;
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserRole().subscribe(role => {
      this.role = role;  // Asumes que 'role' es el rol del usuario logueado
    });

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });
    // Capturar el ID de la plaza desde la ruta
    this.plazaID = this.route.snapshot.paramMap.get('id');

    if (this.plazaID) {
      // Obtener los datos de las plazas y filtrar por el ID de la plaza
      this.authService.getPlazas().subscribe((plazas) => {
        this.plaza = plazas.find((plaza: any) => plaza.id === this.plazaID);      
        this.postulant = this.plaza ? this.plaza.postulant : [];
      });

      // Suscribirse a los cambios en la colección 'postulant' 
      this.authService.getPostulant().subscribe((postulantes) => {
        this.postulant = postulantes.filter(postulante => postulante.plazaID === this.plazaID)
          .map(postulante => {
            this.firestore.collection('users').doc(postulante.userID).get().toPromise().then((userDoc) => {
              if (userDoc && userDoc.exists) {
                postulante.userName = userDoc.get('name') || '';
                postulante.havePlaza = userDoc.get('validated') || false;
              }
            });
            return postulante;
        });
      });
    }

    // this.updateValidatedPostulantsInPlazas();
  }

  // Actualizar el validated en la lista de postulantes de todas plazas desde la coleccion plaza desde la coleccion postulant
  updateValidatedPostulantsInPlazas(): void {
    this.firestore.collection('plazas').get().toPromise().then((plazas) => {
      plazas!.forEach((plazaDoc) => {
        const plazaData = plazaDoc.data() as { postulant: any[] };

        plazaData.postulant?.forEach((postulant) => {
          const postulantId = postulant.id;

          this.firestore.collection('postulant').doc(postulantId).get().toPromise().then((postulantDoc) => {
            if (postulantDoc && postulantDoc.exists) {
              const validated = postulantDoc.get('validated');

              if (validated === undefined) {
                return;
              }

              const postulantIndex = plazaData.postulant?.findIndex(postulant => postulant.id === postulantId);

              if (postulantIndex !== undefined && postulantIndex !== -1) {
                plazaData.postulant[postulantIndex].validated = validated;

                // Actualizar solo el postulante correspondiente en la colección de plazas
                this.firestore.collection('plazas').doc(plazaDoc.id).update({
                  postulant: plazaData.postulant
                }).then(() => {
                  
                }).catch(error => {
                  console.error('Error al actualizar la validación del postulante en la plaza:', error);
                });
              }
            }
          });
        });
      });
    });
  }


  
  // Método para actualizar el campo 'validated' en la colección 'postulant' y 'users'
  updateValidatedPostulantsInUsers(): void {
    this.firestore.collection('postulant').get().toPromise().then((postulants) => {
      postulants!.forEach((postulantDoc) => {
        const postulantData = postulantDoc.data() as { plazaID: string, usuario: { userID: string } };
        const userId = postulantData.usuario?.userID;

        if (userId) {
          this.firestore.collection('users').doc(userId).get().toPromise().then((userDoc) => {
            if (userDoc && userDoc.exists) {
              const validated = userDoc.get('validated') || false;

              this.firestore.collection('postulant').doc(postulantDoc.id).update({
                validated: validated
              });
            }
          });
        }
      });
    });
  }


  // Método para validar o no validar a un postulante y actualizar en 'users'
  validatePostulant(isValid: boolean, postulanteId: string): void {
    if (postulanteId) {
      // Obtener la referencia de la colección 'postulant' y consultar el documento
      this.firestore.collection('postulant').doc(postulanteId).get().toPromise().then((postulantDoc) => {
        if (postulantDoc && postulantDoc.exists) {
          // Extraer el userID del documento del postulante
          const postulantData = postulantDoc.data() as { usuario?: { userID?: string }, plazaID: string };
          const userId = postulantData.usuario?.userID;

          // Actualizar el campo 'validated' en la colección 'postulant'
          this.firestore.collection('postulant').doc(postulanteId).update({
            validated: isValid
          }).then(() => {
            
          }).catch(error => {
            console.error('Error al actualizar la validación del postulante:', error);
          });

          // Obtener los datos de la plaza de la que se postuló el usuario y actualizar el validate en la lista de postulantes
          if (postulantData.plazaID) {
            this.firestore.collection('plazas').doc(postulantData.plazaID).get().toPromise().then((plazaDoc) => {
              if (plazaDoc && plazaDoc.exists) {
                const plazaData = plazaDoc.data() as { postulant: any[] };
                const postulantIndex = plazaData.postulant?.findIndex(postulant => postulant.id === postulanteId);

                if (postulantIndex !== undefined && postulantIndex !== -1) {
                  plazaData.postulant[postulantIndex].validated = isValid;

                  // Actualizar solo el postulante correspondiente en la colección de plazas
                  this.firestore.collection('plazas').doc(postulantData.plazaID).update({
                    postulant: plazaData.postulant
                  }).then(() => {
                    
                  }).catch(error => {
                    console.error('Error al actualizar la validación del postulante en la plaza:', error);
                  });
                }
              }
            });
          }
          
          // Actualizar el campo 'validated' en la colección 'users' si userID existe
          if (userId) {
            this.firestore.collection('users').doc(userId).update({
              validated: isValid
            }).then(() => {
              
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
    
  }

  aceptarPostulante(postulante: any): void {
    // Lógica para aceptar al postulante (ejemplo: actualizar estado en la base de datos)
    
  }

  rechazarPostulante(postulante: any): void {
    // Lógica para rechazar al postulante (ejemplo: actualizar estado en la base de datos)
    
  }

  guardarCambios(postulante: any): void {
    if (this.plazaID) {
      this.isSaving[postulante.id] = true; // Inicia la animación de guardado
      this.saveMessage = 'Guardando cambios...'; // Mensaje inicial

      const updatedPostulante = {
        ...postulante,
        qualificationCycle: postulante.qualificationCycle || null,
        qualificationMirror: postulante.qualificationMirror || null,
        observations: postulante.observations || ''
      };

      // Actualizar solo el postulante correspondiente en la colección de plazas
      this.firestore.collection('plazas').doc(this.plazaID).update({
        postulant: this.postulant // Si es necesario, puedes modificar el array 'postulant' para reflejar solo los cambios de este postulante
      }).then(() => {
        // Actualizar solo el postulante en la colección de postulantes
        this.firestore.collection('postulant').doc(postulante.id).update({
          qualificationCycle: updatedPostulante.qualificationCycle,
          qualificationMirror: updatedPostulante.qualificationMirror,
          observations: updatedPostulante.observations
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