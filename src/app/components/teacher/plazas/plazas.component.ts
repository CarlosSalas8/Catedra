import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-plazas',
  templateUrl: './plazas.component.html',
  styleUrls: ['./plazas.component.css']
})
export class PlazasComponent implements OnInit {

  activePeriod: any | null = null;
  periodoActivo: any;
  periodos: Observable<any[]> | undefined;
  plazas$: Observable<any[]> | undefined;
  carreraUsuario: string | null = null;

  constructor(public periodoService: PeriodoService, private firestore: AngularFirestore, private authService: AuthService) {}
  
  ngOnInit(): void {
    // Obtener la asignatura seleccionada por el usuario desde la colección 'usuarios'
    this.authService.getCurrentUser2().subscribe(user => {
      if (user) {
        this.firestore.collection('usuarios').doc(user.uid).get().subscribe(doc => {
          this.carreraUsuario = doc.get('asignatura');
          this.filtrarPlazas();
        });
      }
    });

    // Suscribirse al período activo
    this.periodoService.activePeriod$.subscribe(periodo => {
      this.activePeriod = periodo;
    });

    this.setupMobileMenuToggle();
  }

  filtrarPlazas() {
    // Filtrar las plazas según la carrera seleccionada por el usuario
    this.plazas$ = this.firestore.collection('plazas', ref => 
      ref.where('asignatura', '==', this.carreraUsuario)
    ).valueChanges();
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
