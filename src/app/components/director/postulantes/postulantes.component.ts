import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-postulantes',
  templateUrl: './postulantes.component.html',
  styleUrls: ['./postulantes.component.css']
})
export class PostulantesComponent implements OnInit {

  activePeriod: any | null = null;
  postulant: any[] = [];
  plaza: any | null = null;
  plazaID: string | null = null; // ID de la plaza seleccionada

  constructor(
    private firestore: AngularFirestore,
    public periodoService: PeriodoService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    // Capturar el ID de la plaza desde la ruta
    this.plazaID = this.route.snapshot.paramMap.get('id');

    if (this.plazaID) {
      // Obtener los datos de las plazas y filtrar por el ID de la plaza
      this.authService.getPlazas().subscribe((plazas) => {
        this.plaza = plazas.find((plaza: any) => plaza.id === this.plazaID);
        this.postulant = this.plaza ? this.plaza.postulant : [];
      });
    }

    // Suscribirse al período status 
    this.periodoService.activePeriod$.subscribe((period) => {
      this.activePeriod = period;
    });
  }

}