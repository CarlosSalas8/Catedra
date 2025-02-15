import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-actividades-docentes',
  templateUrl: './actividades-docentes.component.html',
  styleUrls: ['./actividades-docentes.component.css']
})
export class ActividadesDocentesComponent {

  activity: any;
  activitys: any[] = [];
  teacherId: string | null = null;
  assistantID: string | null = null;
  activePeriod: any | null = null;
  assistantName: string | null = null;

  constructor(public periodoService: PeriodoService, private firestore: AngularFirestore, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    this.route.paramMap.subscribe(params => {
      this.teacherId = params.get('id');
      this.assistantID = params.get('assistant');  // Esto es un ID, no el nombre

      // Extraer el nombre real del asistente desde el último segmento de la URL
      const urlSegments = window.location.pathname.split('/');
      this.assistantName = decodeURIComponent(urlSegments[urlSegments.length - 1]);

      

      if (this.teacherId && this.assistantName) {
        this.cargarActividadesPorEstudiante(this.teacherId, this.assistantName);
      }
    });
  }




  cargarActividadesPorEstudiante(teacherId: string, assistant: string): void {
    this.firestore.collection('activities', ref =>
      ref.where('emailTeacher', '==', teacherId)
        .where('assistant', '==', assistant) // Ahora assistant tiene el nombre correcto
    ).valueChanges().subscribe(data => {
      
      this.activitys = data;
    });
  }




}
