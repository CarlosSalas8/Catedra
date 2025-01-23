import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
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
  userEmail: string | null = null;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private router: Router, public periodoService: PeriodoService, private authService: AuthService) {
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

    // Obtener el usuario logueado
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userEmail = user.email;
        console.log('Usuario logueado:', this.userEmail);
      } else {
        console.error('No hay un usuario autenticado.');
      }
    });

  }

  ngOnDestroy(): void {
    if (this.periodSubscription) {
      this.periodSubscription.unsubscribe();
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
    console.log('Formulario válido. Datos a guardar:', this.form.valid);
    console.log('Periodo activo recibido:', this.activePeriod);

    if (this.form.valid && this.activePeriod) {
      console.log('Formulario válido. Datos a guardar:', this.form.value);

      const formData = this.form.value;
      const nameTeacher = formData.nameTeacher; // Nombre del docente
      const assistant = formData.assistant; // Nombre del asistente

      const generalData = {
        nameTeacher: nameTeacher,
        assistant: assistant,
        faculty: formData.faculty,
        career: formData.career,
        subject: formData.subject,
        modality: formData.modality,
        emailAssistant: this.userEmail  // Agregar el email del usuario logueado
      };

      console.log('Datos generales a guardar:', generalData);

      const batch = this.firestore.firestore.batch();

      // Verificar si el docente ya existe en la colección "teacher"
      this.firestore.collection('teachers', ref => ref.where('name', '==', nameTeacher)).get().subscribe(snapshot => {
        if (snapshot.empty) {
          console.warn('El docente no existe en la base de datos.');
          alert('El docente no está registrado. No se pueden guardar las actividades.');
        } else {
          const teacherDocId = snapshot.docs[0].id; // ID del docente existente

          // Mantener la lógica existente para guardar en la colección de actividades
          this.periodoService.saveActivities(batch, generalData, formData.activities, 'primer_bimestre', this.activePeriod.id);
          this.periodoService.saveActivities(batch, generalData, formData.activitiesSegundo, 'segundo_bimestre', this.activePeriod.id);
          this.periodoService.saveActivities(batch, generalData, formData.activitiesRecuperacion, 'recuperacion', this.activePeriod.id);

          // Realizar el commit del batch para guardar todo
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
        }
      });
    } else {
      console.warn('Formulario inválido o no hay periodo activo');
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
