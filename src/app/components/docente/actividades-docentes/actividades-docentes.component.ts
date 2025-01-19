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

  constructor(public periodoService: PeriodoService,private firestore: AngularFirestore,private route: ActivatedRoute) {}

  ngOnInit(): void {

    
    this.route.paramMap.subscribe(params => {
      this.teacherId = params.get('id'); // Obtener el id del teacher de los parámetros de la ruta
      if (this.teacherId) {
        this.firestore.collection('teachers').doc(this.teacherId).valueChanges().subscribe(teacherData => {
          this.activity = teacherData;
          if (this.activity) {
            this.cargarActividades(this.activity.name);
          }
        });
      }
    });
    
  }

  cargarActividades(teacherName: string): void {
    this.firestore.collection('activities', ref => ref.where('nameTeacher', '==', teacherName)).valueChanges().subscribe(data => {
      this.activitys = data;
    });
  }


}
