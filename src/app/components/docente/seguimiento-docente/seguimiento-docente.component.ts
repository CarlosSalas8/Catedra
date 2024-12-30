import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-seguimiento-docente',
  templateUrl: './seguimiento-docente.component.html',
  styleUrls: ['./seguimiento-docente.component.css']
})
export class SeguimientoDocenteComponent implements OnInit {

  activePeriod: any | null = null;
  
  plazas$: Observable<any[]> | undefined;

  constructor(public periodoService: PeriodoService, private firestore: AngularFirestore) {}

  ngOnInit(): void {

    this.plazas$ = this.firestore.collection('plazas').valueChanges();

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
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