import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
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
  activities: any[] = [];
  assistantID: string | null = null;
  activePeriod: any | null = null;
  assistantName: string | null = null;
  usuario: any = null;
  role!: string;

  showAlertNoApproved: boolean = false

  constructor(
    public periodoService: PeriodoService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {

    this.usuario = await this.authService.getCurrentUser5()

    this.role = this.usuario.role;

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    this.route.paramMap.subscribe(params => {
      this.assistantID = params.get('assistant');  // Esto es un ID, no el nombre

      // Extraer el nombre real del asistente desde el último segmento de la URL
      const urlSegments = window.location.pathname.split('/');
      this.assistantName = decodeURIComponent(urlSegments[urlSegments.length - 1]);

      

      if (this.assistantName) {
        this.cargarActividadesPorEstudiante(this.assistantName);
      }
    });
  }




  cargarActividadesPorEstudiante(assistant: string): void {
    this.firestore.collection('activities', ref =>
      ref.where('assistant', '==', assistant) // Ahora assistant tiene el nombre correcto
    ).valueChanges().subscribe(data => {   
      this.activities = data;
    });
  }

  aprobarEstudiante(activity: any): void {
    // Validar que todas las actividades estén aprobadas
    const allApproved = this.activities.every((act: any) => act.validate === true);
    if (!allApproved) {
      this.toggleNoApprovedAlert();
      return;
    }
    
    // Obtener las personas que aprobaron al estudiante
    this.firestore.collection('postulant', ref => ref.where('plazaID', '==', activity.plazaID)).valueChanges().subscribe((data: any) => {
      const postulant = data[0];
      const approvedBy = postulant.approvedBy || [];
      approvedBy.push({
        name: this.usuario.name,
        role: this.usuario.role,
        date: Timestamp.now()
      });

      this.firestore.collection('postulant').doc(postulant.id).update({ state: 'approved', approvedBy: approvedBy });
    });
  }

  toggleNoApprovedAlert(): void {
    this.showAlertNoApproved = !this.showAlertNoApproved;
  }
}