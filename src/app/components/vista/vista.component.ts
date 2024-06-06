import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.css']
})
export class VistaComponent implements OnInit{

  actividadesPrimerBimestre: Observable<any[]> | undefined;
  actividadesSegundoBimestre: Observable<any[]> | undefined;
  actividadesRecuperacion: Observable<any[]> | undefined;

  constructor(private firestore: AngularFirestore, private router: Router) { }

  ngOnInit(): void {
    this.actividadesPrimerBimestre = this.firestore.collection('items', ref => ref.where('tipo', '==', 'primer_bimestre')).valueChanges();
    this.actividadesSegundoBimestre = this.firestore.collection('items', ref => ref.where('tipo', '==', 'segundo_bimestre')).valueChanges();
    this.actividadesRecuperacion = this.firestore.collection('items', ref => ref.where('tipo', '==', 'recuperacion')).valueChanges();
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
