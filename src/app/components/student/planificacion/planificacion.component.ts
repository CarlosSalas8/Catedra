import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, of, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { Activity } from '../../models/activity.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
  plazasDelUsuario: any[] = [];
  activitiesLoaded = false;

  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private router: Router, public periodoService: PeriodoService, private authService: AuthService, private afAuth: AngularFireAuth) {
    this.form = this.fb.group({
      nameTeacher: ['', Validators.required],
      assistant: ['', Validators.required],
      faculty: ['', Validators.required],
      career: ['', Validators.required],
      subject: ['', Validators.required],
      parallel: ['', Validators.required],
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
        if (user.email) {
          this.obtenerPlazasDelUsuario(user.email); // Pasar el email del usuario
        }
      } else {
        console.error('No hay un usuario autenticado.');
      }
    });

    if (!this.activitiesLoaded) {
      this.authService.getActivities().subscribe(activities => {
        this.setActivities(activities);
        this.activitiesLoaded = true;  // Evita cargar las actividades más de una vez
      });
    }

  }

  setActivities(activities: any[]): void {
    this.afAuth.authState.pipe(
      take(1), // Tomamos solo el primer estado de autenticación
      switchMap(user => {
        if (!user) return of([]); // Si no hay usuario, devolvemos un observable vacío
        return this.firestore.collection('activities', ref =>
          ref.where('emailAssistant', '==', user.email)
        ).valueChanges();
      })
    ).subscribe(filteredActivities => {
      filteredActivities.forEach((activity: any) => {
        let activitiesArray: FormArray;

        // Determinar a qué array de actividades pertenece según el campo "type"
        switch (activity.type) {
          case 'segundo_bimestre':
            activitiesArray = this.form.get('activitiesSegundo') as FormArray;
            break;
          case 'recuperacion':
            activitiesArray = this.form.get('activitiesRecuperacion') as FormArray;
            break;
          default:
            activitiesArray = this.form.get('activities') as FormArray; // Primer bimestre
            break;
        }

        // Evitar agregar actividades duplicadas
        const existingActivity = activitiesArray.controls.find(ctrl =>
          ctrl.get('activity')?.value === activity.activity &&
          ctrl.get('startdate')?.value === activity.startdate &&
          ctrl.get('enddate')?.value === activity.enddate
        );

        if (!existingActivity) {
          activitiesArray.push(this.fb.group({
            activity: [activity.activity],
            startdate: [activity.startdate],
            enddate: [activity.enddate],
            verificationmethod: [activity.verificationmethod]
          }));
        }
      });
    });
  }

  confirmRemoveItem(index: number, type: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      this.removeItem(index, type);
    }
  }

  removeItem(index: number, type: string): void {
    let activitiesArray: FormArray;

    switch (type) {
      case 'segundo_bimestre':
        activitiesArray = this.activitiesSegundo;
        break;
      case 'recuperacion':
        activitiesArray = this.activitiesRecuperacion;
        break;
      default:
        activitiesArray = this.activities;
        break;
    }

    const activity = activitiesArray.at(index).value;

    // Eliminar de Firebase
    this.firestore.collection('activities', ref =>
      ref.where('activity', '==', activity.activity)
        .where('startdate', '==', activity.startdate)
        .where('enddate', '==', activity.enddate)
        .where('emailAssistant', '==', this.userEmail)
    ).get().subscribe(snapshot => {
      snapshot.forEach(doc => {
        this.firestore.collection('activities').doc(doc.id).delete();
      });
    });

    // Eliminar de la página
    activitiesArray.removeAt(index);
  }

  obtenerPlazasDelUsuario(email: string) {
    this.firestore.collection('plazas').valueChanges().pipe(take(1)).subscribe((plazas: any[]) => {
      this.plazasDelUsuario = plazas.filter((plaza: any) =>
        plaza.postulant?.some((p: any) => p.usuario?.email === email)
      );

      if (this.plazasDelUsuario.length > 0) {
        const datos = this.plazasDelUsuario[0];  // Primer registro encontrado
        this.form.patchValue({
          nameTeacher: datos.nameTeacher || '',
          assistant: datos.postulant?.find((p: any) => p.usuario?.email === email)?.usuario?.name || '',
          faculty: datos.faculty || '',
          career: datos.career || '',       
          subject: datos.subject || '',
          parallel: datos.parallel || '',
          modality: datos.modality || ''
        });
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

  async guardarDatos() {
    if (!this.form.valid || !this.activePeriod) {
      console.warn('Formulario inválido o no hay periodo activo');
      alert('Por favor, completa todos los campos del formulario y asegúrate de que hay un periodo activo.');
      return;
    }

    console.log('Formulario válido. Datos a guardar:', this.form.value);

    const formData = this.form.value;
    const nameTeacher = formData.nameTeacher;
    const assistant = formData.assistant;

    const generalData: any = {
      nameTeacher: nameTeacher,
      assistant: assistant,
      faculty: formData.faculty,
      career: formData.career,
      subject: formData.subject,
      parallel: formData.parallel,
      modality: formData.modality,
      emailAssistant: this.userEmail
    };

    try {
      // 🔹 Obtener el docente desde la colección 'teachers'
      const snapshot = await firstValueFrom(
        this.firestore.collection('teachers', ref => ref.where('name', '==', nameTeacher)).get()
      );

      if (snapshot.empty) {
        console.warn('El docente no existe en la base de datos.');
        alert('El docente no está registrado. No se pueden guardar las actividades.');
        return;
      }

      // 🔹 Obtener el email del docente
      const teacherDoc = snapshot.docs[0];
      const teacherData = teacherDoc.data() as { email: string };
      generalData.emailTeacher = teacherData.email; // Guardar el email del docente

      console.log('Datos generales a guardar con email del docente:', generalData);

      // 🔹 Consultar las actividades existentes en Firebase para evitar duplicación
      const activitiesSnapshot = await firstValueFrom(
        this.firestore.collection('activities', ref => ref.where('periodID', '==', this.activePeriod.id)).get()
      );

      const existingActivities: Activity[] = activitiesSnapshot.docs.map(doc => doc.data() as Activity);

      const batch = this.firestore.firestore.batch();

      // 🔹 Filtrar las actividades que no están ya en Firebase
      formData.activities = formData.activities.filter((activity: Activity) => {
        return !existingActivities.some((existing: Activity) => {
          const existingStartDate = existing.startdate instanceof Date
            ? existing.startdate
            : existing.startdate.toDate ? existing.startdate.toDate()
              : new Date(existing.startdate);

          const existingEndDate = existing.enddate instanceof Date
            ? existing.enddate
            : existing.enddate.toDate ? existing.enddate.toDate()
              : new Date(existing.enddate);

          return (
            existing.activity === activity.activity &&
            existingStartDate.getTime() === new Date(activity.startdate).getTime() &&
            existingEndDate.getTime() === new Date(activity.enddate).getTime()
          );
        });
      });

      formData.activitiesSegundo = formData.activitiesSegundo.filter((activity: Activity) => {
        return !existingActivities.some((existing: Activity) => {
          const existingStartDate = existing.startdate instanceof Date
            ? existing.startdate
            : existing.startdate.toDate ? existing.startdate.toDate()
              : new Date(existing.startdate);

          const existingEndDate = existing.enddate instanceof Date
            ? existing.enddate
            : existing.enddate.toDate ? existing.enddate.toDate()
              : new Date(existing.enddate);

          return (
            existing.activity === activity.activity &&
            existingStartDate.getTime() === new Date(activity.startdate).getTime() &&
            existingEndDate.getTime() === new Date(activity.enddate).getTime()
          );
        });
      });

      formData.activitiesRecuperacion = formData.activitiesRecuperacion.filter((activity: Activity) => {
        return !existingActivities.some((existing: Activity) => {
          const existingStartDate = existing.startdate instanceof Date
            ? existing.startdate
            : existing.startdate.toDate ? existing.startdate.toDate()
              : new Date(existing.startdate);

          const existingEndDate = existing.enddate instanceof Date
            ? existing.enddate
            : existing.enddate.toDate ? existing.enddate.toDate()
              : new Date(existing.enddate);

          return (
            existing.activity === activity.activity &&
            existingStartDate.getTime() === new Date(activity.startdate).getTime() &&
            existingEndDate.getTime() === new Date(activity.enddate).getTime()
          );
        });
      });
      // 🔹 Guardar solo las actividades no duplicadas
      this.periodoService.saveActivities(batch, generalData, formData.activities, 'primer_bimestre', this.activePeriod.id);
      this.periodoService.saveActivities(batch, generalData, formData.activitiesSegundo, 'segundo_bimestre', this.activePeriod.id);
      this.periodoService.saveActivities(batch, generalData, formData.activitiesRecuperacion, 'recuperacion', this.activePeriod.id);

      await batch.commit();

      console.log('Datos guardados correctamente en Firebase');
      this.form.reset();
      alert('¡Datos guardados correctamente!');
      this.router.navigateByUrl('/vista');
    } catch (error) {
      console.error('Error al guardar los datos en Firebase:', error);
      alert('Error al guardar los datos. Por favor, inténtalo de nuevo.');
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