import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.css']
})
export class ValidarComponent implements OnInit {
  activity: any;
  teacher: any;
  teacherId: string | null = null;
  validationMessage: string = '';
  activePeriod: any | null = null;

  constructor(private firestore: AngularFirestore,public periodoService: PeriodoService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    const actividadId = this.route.snapshot.paramMap.get('actividadId');
    if (actividadId) {
      this.firestore.collection('activities').doc(actividadId).valueChanges().subscribe(actividadData => {
        this.activity = actividadData;
      });
    }

    this.route.paramMap.subscribe(params => {
      this.teacherId = params.get('id'); // Obtener el id del teacher de los parámetros de la ruta
      if (this.teacherId) {
        this.firestore.collection('teachers').doc(this.teacherId).valueChanges().subscribe(teacherData => {
          this.teacher = teacherData;
        });
      }
    });

  }


  validateActivity(isValid: boolean): void {
    if (this.activity) {
      const activityId = this.route.snapshot.paramMap.get('actividadId');
      if (activityId) {
        this.firestore.collection('activities').doc(activityId).update({
          validated: isValid
        });
      }
    }
  }




}
