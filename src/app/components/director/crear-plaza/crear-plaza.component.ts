import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-crear-plaza',
  templateUrl: './crear-plaza.component.html',
  styleUrls: ['./crear-plaza.component.css']
})
export class CrearPlazaComponent implements OnInit {

  activePeriod: any | null = null;

  periodoActivo: any;

  periodos: Observable<any[]> | undefined;

  constructor(public periodoService: PeriodoService) {}

  ngOnInit(): void {
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
