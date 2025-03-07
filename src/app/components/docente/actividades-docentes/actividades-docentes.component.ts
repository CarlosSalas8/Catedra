import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-actividades-docentes',
  templateUrl: './actividades-docentes.component.html',
  styleUrls: ['./actividades-docentes.component.css']
})
export class ActividadesDocentesComponent {

  activity: any;
  activitys: any[] = [];
  assistantID: string | null = null;
  activePeriod: any | null = null;
  assistantName: string | null = null;
  usuario: any = null;

  successMessage: string = '';
  isApproved: boolean | null = null;

  constructor(
    public periodoService: PeriodoService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Recuperar el estado almacenado si existe
    const storedMessage = localStorage.getItem('successMessage');
    const storedApproval = localStorage.getItem('isApproved');

    if (storedMessage) {
      this.successMessage = storedMessage;
    }

    if (storedApproval) {
      this.isApproved = storedApproval === 'true'; // Recuperar y convertir de string a booleano
    }

    this.authService.getCurrentUserRole().subscribe(role => {
      this.usuario = role;  // Asumes que 'role' es el rol del usuario logueado
    });

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    this.route.paramMap.subscribe(params => {
      this.assistantID = params.get('assistant');  // Esto es un ID, no el nombre

      const urlSegments = window.location.pathname.split('/');
      this.assistantName = decodeURIComponent(urlSegments[urlSegments.length - 1]);

      if (this.assistantName) {
        this.cargarActividadesPorEstudiante(this.assistantName);
      }
    });
  }

  cargarActividadesPorEstudiante(assistant: string): void {
    this.firestore.collection('activities', ref =>
      ref.where('assistant', '==', assistant)
    ).valueChanges().subscribe(data => {
      this.activitys = data;
    });
  }

  aprobarEstudiante(aprobado: boolean) {
    if (!this.assistantName) return;

    this.firestore.collection('activities', ref => ref.where('assistant', '==', this.assistantName))
      .get().toPromise().then(snapshot => {
        const batch = this.firestore.firestore.batch();
        snapshot?.forEach(doc => {
          batch.update(doc.ref, { validatedCurriculums: aprobado });
        });

        return batch.commit();
      }).then(() => {
        console.log("Actividades actualizadas correctamente.");

        this.successMessage = aprobado ? 'Estudiante aprobado.' : 'Estudiante desaprobado.';
        this.isApproved = aprobado; // Establece el estado de aprobación

        // Guardar el estado en localStorage
        localStorage.setItem('successMessage', this.successMessage);
        localStorage.setItem('isApproved', this.isApproved.toString());

        return this.firestore.collection('users', ref => ref.where('name', '==', this.assistantName))
          .get().toPromise();
      }).then(userSnapshot => {
        if (userSnapshot && !userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0].ref;
          return userDoc.update({ validatedCurriculums: aprobado });
        }
        return Promise.resolve();
      }).then(() => {
        console.log("Usuario actualizado correctamente.");
      }).catch(error => {
        console.error("Error al aprobar/desaprobar:", error);
      });
  }
}

