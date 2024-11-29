import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.css']
})
export class VistaComponent implements OnInit{
  activePeriod: any | null = null;
  actividadesPrimerBimestre: Observable<any[]> | undefined;
  actividadesSegundoBimestre: Observable<any[]> | undefined;
  actividadesRecuperacion: Observable<any[]> | undefined;
  periodos: Observable<any[]> | undefined;
  selectedPeriodId: string | undefined;

  constructor(private firestore: AngularFirestore, private router: Router, public periodoService: PeriodoService) { }

  ngOnInit(): void {
    this.actividadesPrimerBimestre = this.periodoService.getActivitiesByActivePeriod('primer_bimestre');
    this.actividadesSegundoBimestre = this.periodoService.getActivitiesByActivePeriod('segundo_bimestre');
    this.actividadesRecuperacion = this.periodoService.getActivitiesByActivePeriod('recuperacion');
    this.periodoService.activePeriod$.subscribe(periodo => {
      this.activePeriod = periodo;
    });
    this.setupMobileMenuToggle();
  }

  

  revisarActividad(id: string): void {
    this.router.navigate(['/revisar', id]);
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
