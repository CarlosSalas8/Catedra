import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-planificacion',
  templateUrl: './planificacion.component.html',
  styleUrls: ['./planificacion.component.css']
})
export class PlanificacionComponent implements OnInit, OnDestroy {

  form: FormGroup;
  activePeriod: any | null = null;
  showPeriodInput: boolean = false;
  periodoGuardado: boolean = false;
  periodos: Observable<any[]> | undefined;
  private periodSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private router: Router, public periodoService: PeriodoService) {
    this.form = this.fb.group({
      nameTeacher: ['', Validators.required],
      assistant: ['', Validators.required],
      faculty: ['', Validators.required],
      career: ['', Validators.required],
      subject: ['', Validators.required],
      modality: ['', Validators.required],
      activities: this.fb.array([]), // Primer bimestre
      activitiesSegundo: this.fb.array([]), // Segundo bimestre
      activitiesRecuperacion: this.fb.array([]),  // Recuperación
      
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

  ngOnDestroy(): void {
    if (this.periodSubscription) {
      this.periodSubscription.unsubscribe();
    }
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

  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  get activitiesSegundo(): FormArray {
    return this.form.get('activitiesSegundo') as FormArray;
  }

  get activitiesRecuperacion(): FormArray {
    return this.form.get('activitiesRecuperacion') as FormArray;
  }

  removeItems(index: number): void {
    this.activities.removeAt(index);
  }

  removeItemsSegundo(index: number): void {
    this.activitiesSegundo.removeAt(index);
  }

  removeItemsRecuperacion(index: number): void {
    this.activitiesRecuperacion.removeAt(index);
  }

  addItems(): void {
    this.activities.push(this.createItem());
  }

  addItemsSegundo(): void {
    this.activitiesSegundo.push(this.createItem());
  }

  addItemsRecuperacion(): void {
    this.activitiesRecuperacion.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.fb.group({
      activity: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      verificationmethod: ['', Validators.required]
    });
  }

  

  guardarDatos(): void {
    // Verifica si el formulario es válido
    console.log('Formulario válido. Datos a guardar:', this.form.valid);
    console.log('Periodo activo recibido:', this.activePeriod);

    if (this.form.valid && this.activePeriod) {
      console.log('Formulario válido. Datos a guardar:', this.form.value);

      const formData = this.form.value;

      const generalData = {
        nameTeacher: formData.nameTeacher,
        assistant: formData.assistant,
        faculty: formData.faculty,
        career: formData.career,
        subject: formData.subject,
        modality: formData.modality
      };

      console.log('Datos generales a guardar:', generalData);

      const batch = this.firestore.firestore.batch();

      // Guardar actividades en Firebase
      try {
        this.periodoService.saveActivities(batch, generalData, formData.activities, 'primer_bimestre', this.activePeriod.id);
        this.periodoService.saveActivities(batch, generalData, formData.activitiesSegundo, 'segundo_bimestre', this.activePeriod.id);
        this.periodoService.saveActivities(batch, generalData, formData.activitiesRecuperacion, 'recuperacion', this.activePeriod.id);

        batch.commit()
          .then(() => {
            console.log('Datos guardados correctamente en Firebase');
            this.form.reset();
            alert('¡Datos guardados correctamente!');
            this.router.navigateByUrl('/vista');
          })
          .catch(error => {
            console.error('Error al guardar los datos en Firebase:', error);
            alert('Error al guardar los datos. Por favor, inténtalo de nuevo.');
          });
      } catch (e) {
        console.error('Error inesperado durante el guardado:', e);
      }
    } else {
      console.warn('Formulario inválido o no hay period activo');
      alert('Por favor, completa todos los campos del formulario y asegúrate de que hay un periodo activo.');
    }
  }


  // Métodos para obtener los controles específicos del Primer Bimestre
  getactivityControl(index: number): FormControl {
    return this.activities.at(index).get('activity') as FormControl;
  }

  getstartdateControl(index: number): FormControl {
    return this.activities.at(index).get('startdate') as FormControl;
  }

  getenddateControl(index: number): FormControl {
    return this.activities.at(index).get('enddate') as FormControl;
  }

  getverificationmethodControl(index: number): FormControl {
    return this.activities.at(index).get('verificationmethod') as FormControl;
  }

  // Métodos para obtener los controles específicos del Segundo Bimestre
  getactivitySegundoControl(index: number): FormControl {
    return this.activitiesSegundo.at(index).get('activity') as FormControl;
  }

  getstartdateSegundoControl(index: number): FormControl {
    return this.activitiesSegundo.at(index).get('startdate') as FormControl;
  }

  getenddateSegundoControl(index: number): FormControl {
    return this.activitiesSegundo.at(index).get('enddate') as FormControl;
  }

  getverificationmethodSegundoControl(index: number): FormControl {
    return this.activitiesSegundo.at(index).get('verificationmethod') as FormControl;
  }

  // Métodos para obtener los controles específicos de la Recuperación
  getactivityRecuperacionControl(index: number): FormControl {
    return this.activitiesRecuperacion.at(index).get('activity') as FormControl;
  }

  getstartdateRecuperacionControl(index: number): FormControl {
    return this.activitiesRecuperacion.at(index).get('startdate') as FormControl;
  }

  getenddateRecuperacionControl(index: number): FormControl {
    return this.activitiesRecuperacion.at(index).get('enddate') as FormControl;
  }

  getverificationmethodRecuperacionControl(index: number): FormControl {
    return this.activitiesRecuperacion.at(index).get('verificationmethod') as FormControl;
  }
}
