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

  activePeriod: any | null = null;
  postulant: any[] = [];
  plaza: any | null = null;
  plazaID: string | null = null; // ID de la plaza seleccionada

  isSaving: { [key: string]: boolean } = {}; // Indica si se están guardando los datos
  saveMessage: string = ''; // Mensaje de estado para mostrar al usuario

  constructor(
    private firestore: AngularFirestore,
    public periodoService: PeriodoService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

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

    // Suscribirse al período status 
    this.periodoService.activePeriod$.subscribe((period) => {
      this.activePeriod = period;
    });
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