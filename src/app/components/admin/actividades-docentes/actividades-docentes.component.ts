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
  actividad: any;
  actividades: any[] = [];
  docenteId: string | null = null;

  constructor(public periodoService: PeriodoService,private firestore: AngularFirestore,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.docenteId = params.get('id'); // Obtener el id del docente de los parámetros de la ruta
      if (this.docenteId) {
        this.firestore.collection('docentes').doc(this.docenteId).valueChanges().subscribe(docenteData => {
          this.actividad = docenteData;
          if (this.actividad) {
            this.cargarActividades(this.actividad.nombre);
          }
        });
      }
    });
    this.periodoService.activePeriod$.subscribe(periodo => {
      this.activePeriod = periodo;
    });
    this.setupMobileMenuToggle();
  }

  cargarActividades(docenteNombre: string): void {
    this.firestore.collection('items', ref => ref.where('docente', '==', docenteNombre)).valueChanges().subscribe(data => {
      this.actividades = data;
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
