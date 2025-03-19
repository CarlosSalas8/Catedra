import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  activities: any[] = [];
  assistantID: string | null = null;
  activePeriod: any | null = null;
  assistantName: string | null = null;
  role: any = null;

  constructor(
    public periodoService: PeriodoService,
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log();
    
    this.authService.getCurrentUserRole().subscribe(role => {
      this.role = role;  // Asumes que 'role' es el rol del usuario logueado
    });

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
      console.log(data);
        
      this.activities = data;
    });
  }
}
