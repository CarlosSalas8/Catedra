import { Component, OnInit } from '@angular/core';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-ventanas',
  templateUrl: './ventanas.component.html',
  styleUrls: ['./ventanas.component.css']
})
export class VentanasComponent implements OnInit{

  activePeriod: any | null = null;

  constructor(public periodoService: PeriodoService){}
  
  ngOnInit(): void {
    this.setupMobileMenuToggle();
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
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
