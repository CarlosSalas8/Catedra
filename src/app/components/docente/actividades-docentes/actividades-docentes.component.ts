import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
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
  activePeriod: any | null = null;

  constructor(public periodoService: PeriodoService,private firestore: AngularFirestore,private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    
    this.route.paramMap.subscribe(params => {
      this.teacherId = params.get('id'); 
      const assistantName = params.get('assistant'); // Obtener el nombre del asistente
    
      if (this.teacherId && assistantName) { 
        this.firestore.collection('teachers').doc(this.teacherId).valueChanges().subscribe(teacherData => {
          this.activity = teacherData;
          if (this.activity) {
            this.cargarActividades(this.activity.name, assistantName); // Pasar el asistente para filtrar
          }
        });
      }
    });    
    
    
  }

  cargarActividades(teacherName: string, assistantName: string): void {
    this.firestore.collection('activities', ref => 
      ref.where('nameTeacher', '==', teacherName)
         .where('assistant', '==', assistantName) // Filtrar por el estudiante seleccionado
    ).valueChanges().subscribe(data => {
      this.activitys = data;
    });
  }
  


}