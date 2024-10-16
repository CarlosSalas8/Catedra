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
  actividad: any;
  activePeriod: any | null = null;
  docente: any;
  docenteId: string | null = null;

  constructor(public periodoService: PeriodoService,private firestore: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    const actividadId = this.route.snapshot.paramMap.get('actividadId');
    if (actividadId) {
      this.firestore.collection('items').doc(actividadId).valueChanges().subscribe(actividadData => {
        this.actividad = actividadData;
      });
    }

    this.route.paramMap.subscribe(params => {
      this.docenteId = params.get('id'); // Obtener el id del docente de los parámetros de la ruta
      if (this.docenteId) {
        this.firestore.collection('docentes').doc(this.docenteId).valueChanges().subscribe(docenteData => {
          this.docente = docenteData;
        });
      }
    });

    this.periodoService.activePeriod$.subscribe(periodo => {
      this.activePeriod = periodo;
    });

    this.setupMobileMenuToggle();
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
