import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute) { }

  ngOnInit(): void {

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




}
