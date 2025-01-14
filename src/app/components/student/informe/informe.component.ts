import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {

  form: FormGroup;

  activePeriod: any | null = null;

  showAlert: boolean = false;
  showError: boolean = false;

  constructor(public periodoService: PeriodoService, private fb: FormBuilder, private firestore: AngularFirestore, private router: Router) {
    this.form = this.fb.group({
      nameTeacher: ['', Validators.required],
      assistant: ['', Validators.required],
      faculty: ['', Validators.required],
      career: ['', Validators.required],
      subject: ['', Validators.required],
      modality: ['', Validators.required],
      firstTermAvg : ['', Validators.required],
      secondTermAvg : ['', Validators.required],
      studentCount : ['', Validators.required],

      introduction: ['', Validators.required],
      generalObjective: ['', Validators.required],
      specificObjective1: ['', Validators.required],
      specificObjective2: ['', Validators.required],
      specificObjective3: ['', Validators.required],
      summary: ['', Validators.required],
      methodology: ['', Validators.required],
      tools: ['', Validators.required],
      resultsAnalysis: ['', Validators.required],
      conclusions: ['', Validators.required],
      bibliography: ['', Validators.required],

    });
    console.log('Formulario inicializado:', this.form); // Para validar que el formulario está correctamente creado
  }



  ngOnInit(): void {
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
      console.log('Periodo activo recibido:', this.activePeriod);
    });
    this.setupMobileMenuToggle();

  }


  guardarDatos(): void {
    if (this.form.valid && this.activePeriod) {
      const formData = this.form.value;
  
      // Preparar datos a guardar en Firebase
      const reportData = {
        ...formData, // Incluye todos los campos del formulario
        periodID: this.activePeriod ? this.activePeriod.id : null, // Incluye el periodo activo
      };
  
      // Guardar en Firebase
      this.firestore
        .collection('report') // Nombre de la colección
        .add(reportData)
        .then(() => {
          console.log('Datos guardados exitosamente en Firebase');
          this.mostrarAlerta('success'); // Redirigir o mostrar un mensaje de éxito
          this.router.navigate(['/ver-informe']);

        })
        .catch(error => {
          console.error('Error al guardar los datos:', error);
          this.mostrarAlerta('error');
        });
    } else {
      console.error('Formulario no válido o periodo activo no disponible.');
    }
  }


  mostrarAlerta(tipo: 'success' | 'error'): void {
    if (tipo === 'success') {
      this.showAlert = true;
      this.showError = false;
    } else if (tipo === 'error') {
      this.showError = true;
      this.showAlert = false;
    }
  
    setTimeout(() => {
      this.showAlert = false;
      this.showError = false; // Oculta ambas alertas después de 4 segundos
    }, 4000);
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
