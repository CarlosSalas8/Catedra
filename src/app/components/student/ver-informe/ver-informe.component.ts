import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-ver-informe',
  templateUrl: './ver-informe.component.html',
  styleUrls: ['./ver-informe.component.css']
})
export class VerInformeComponent implements OnInit {

  reportData: any | null = null;
  activePeriod: any | null = null;

  constructor(private firestore: AngularFirestore, public periodoService: PeriodoService) { }

  ngOnInit(): void {
    // Aquí cargamos los datos desde Firebase
    this.cargarDatos();

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
      console.log('Periodo activo recibido:', this.activePeriod);
    });
    this.setupMobileMenuToggle();
  }

  cargarDatos(): void {
    this.firestore.collection('report', ref => ref.limit(1).orderBy('periodID', 'desc')).get().subscribe(snapshot => {
      if (!snapshot.empty) {
        this.reportData = snapshot.docs[0].data();
        console.log('Datos cargados:', this.reportData);
      } else {
        console.error('No se encontraron datos.');
      }
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
