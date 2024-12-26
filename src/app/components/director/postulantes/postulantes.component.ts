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
  postulantes: any[] = [];
  plaza: any | null = null;
  plazaId: string | null = null; // ID de la plaza seleccionada

  constructor(
    private firestore: AngularFirestore,
    public periodoService: PeriodoService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    // Capturar el ID de la plaza desde la ruta
    this.plazaId = this.route.snapshot.paramMap.get('id');

    if (this.plazaId) {
      // Obtener los datos de las plazas y filtrar por el ID de la plaza
      this.authService.getPlazas().subscribe((plazas) => {
        this.plaza = plazas.find((plaza: any) => plaza.id === this.plazaId);
        this.postulantes = this.plaza ? this.plaza.postulantes : [];
      });
    }

    // Suscribirse al período activo
    this.periodoService.activePeriod$.subscribe((periodo) => {
      this.activePeriod = periodo;
    });
  }

}