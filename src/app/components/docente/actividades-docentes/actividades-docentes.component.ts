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
  activePeriod: any | null = null;
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
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });
    this.setupMobileMenuToggle();
  }

  cargarActividades(teacherName: string): void {
    this.firestore.collection('activities', ref => ref.where('nameTeacher', '==', teacherName)).valueChanges().subscribe(data => {
      this.activitys = data;
    });
  }



  setupMobileMenuToggle(): void {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconClosed = menuButton?.children[2] as HTMLElement;
    const menuIconOpened = menuButton?.children[3] as HTMLElement;

    if (menuButton) {
      menuButton.addEventListener('click', () => {
        if (mobileMenu) {
          mobileMenu.classList.toggle('hidden');
        }
        if (menuIconClosed && menuIconOpened) {
          menuIconClosed.classList.toggle('hidden');
          menuIconOpened.classList.toggle('hidden');
        }
      });
    }
  }

}
