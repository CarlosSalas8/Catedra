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
  activity: any;
  activePeriod: any | null = null;
  teacher: any;
  teacherId: string | null = null;

  constructor(public periodoService: PeriodoService,private firestore: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    const actividadId = this.route.snapshot.paramMap.get('actividadId');
    if (actividadId) {
      this.firestore.collection('activities').doc(actividadId).valueChanges().subscribe(actividadData => {
        this.activity = actividadData;
      });
    }

    this.route.paramMap.subscribe(params => {
      this.teacherId = params.get('id'); // Obtener el id del teacher de los parámetros de la ruta
      if (this.teacherId) {
        this.firestore.collection('teachers').doc(this.teacherId).valueChanges().subscribe(teacherData => {
          this.teacher = teacherData;
        });
      }
    });

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
