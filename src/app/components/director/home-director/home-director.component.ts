import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-home-director',
  templateUrl: './home-director.component.html',
  styleUrls: ['./home-director.component.css']
})
export class HomeDirectorComponent implements OnInit {
  activePeriod: any | null = null;

  periodoActivo: any;

  periodos: Observable<any[]> | undefined;

  constructor(public periodoService: PeriodoService) {}

  ngOnInit(): void {
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
