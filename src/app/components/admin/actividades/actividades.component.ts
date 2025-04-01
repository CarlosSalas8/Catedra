import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.css']
})
export class ActividadesComponent {
  activity: any;
  postulant: any;
  activities: any[] = [];
  assistantID: string | null = null;
  activePeriod: any | null = null;
  assistantName: string | null = null;
  user!: any;
  role!: string;
  showAlertNoApproved: boolean = false;

  constructor(
    public periodoService: PeriodoService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getCurrentUser5()

    this.role = this.user.role;

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    this.route.paramMap.subscribe(params => {
      this.assistantID = params.get('idAssistant');  // Esto es un ID, no el nombre

      // Extraer el nombre real del asistente desde el último segmento de la URL
      const urlSegments = window.location.pathname.split('/');
      this.assistantName = decodeURIComponent(urlSegments[urlSegments.length - 1]);

      this.cargarActividadesPorEstudiante(this.assistantID!);

      
    });
  }

  cargarActividadesPorEstudiante(emailAssistant: string): void {
    this.firestore.collection('activities', ref =>
      ref.where('emailAssistant', '==', emailAssistant)
      // .where('plazaID', '==', 'approved')
    ).valueChanges().subscribe(data => {
        
      this.activities = data;

      // Cargar posutulante
      this.firestore.collection('postulant', ref => ref.where('plazaID', '==', this.activities[0].plazaID)).valueChanges().subscribe(data => {
        this.postulant = data[0];
      });
    });
  }

  aprobarEstudiante(activity: any): void {
    // Validar que todas las actividades estén aprobadas
    const allApproved = this.activities.every((act: any) => act.validated === true);
    if (!allApproved) {
      this.toggleNoApprovedAlert();
      return;
    }

    let postulant: any;
    let approvedBy: any[] = [];
    
    // Obtener las personas que aprobaron al estudiante
    this.firestore.collection('postulant', ref => ref.where('plazaID', '==', activity.plazaID))
      .get().toPromise().then((querySnapshot) => {
      postulant = querySnapshot!.docs[0].data();
      approvedBy = postulant.approvedBy || [];

      const existingApprovalIndex = approvedBy.findIndex((approver: any) => approver.uid === this.user.uid);

      if (existingApprovalIndex !== -1) {
        // Toggle the state between 'Validado' and 'No Validado'
        approvedBy[existingApprovalIndex].state = approvedBy[existingApprovalIndex].state === 'Validado' ? 'No Validado' : 'Validado';
        approvedBy[existingApprovalIndex].date = Timestamp.now();
      } else {
        approvedBy.push({
          name: this.user.name, 
          email: this.user.email,
          uid: this.user.userID,
          state: 'Validado',
          date: Timestamp.now()
        });
      }

      console.log({ state: 'Validado', approvedBy: approvedBy });
      

      this.firestore.collection('postulant').doc(postulant.id).update({ state: 'Validado', approvedBy: approvedBy });
    });


    // .valueChanges().subscribe((data: any) => {
    //   postulant = data[0];
    //   approvedBy = postulant.approvedBy || [];
    // });
  }

  toggleNoApprovedAlert(): void {
    this.showAlertNoApproved = !this.showAlertNoApproved;
  }
}