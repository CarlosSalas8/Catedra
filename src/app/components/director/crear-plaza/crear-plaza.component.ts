import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-crear-plaza',
  templateUrl: './crear-plaza.component.html',
  styleUrls: ['./crear-plaza.component.css'],
})
export class CrearPlazaComponent implements OnInit {
  form: FormGroup;
  activePeriod: any | null = null;
  isModalOpen: boolean = false;
  selectedPlaza: any | null = null;
  plazas$: Observable<any[]> | undefined;
  directors: any = null;

  academicCycles: string[] = [];
  curriculums: string[] = [];
  faculties: string[] = [];

  constructor(
    public periodoService: PeriodoService,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      nameTeacher: ['', Validators.required],
      emailTeacher: ['', Validators.required],
      parallel: ['', Validators.required],
      curriculum: ['', Validators.required],
      academicCycle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Cargar plazas asociadas al usuario autenticado
    this.auth.user.subscribe((user) => {
      if (user && user.email) {
        this.getDirectorAutenticado(user.email);
        this.cargarPlazas(user.email);
      }
    });

    // Suscribirse al período status 
    this.periodoService.activePeriod$.subscribe((period) => {
      this.activePeriod = period;
    });

    this.cargarCiclos();
    this.cargarMallas();



  }

  

  cargarMallas() {
    this.firestore.collection('curriculums').valueChanges().subscribe((data: any[]) => {
      this.curriculums = data.map(item => item.name);
    });
  }


  getDirectorAutenticado(email: string): void {
    this.firestore
      .collection('directors', (ref) => ref.where('email', '==', email))
      .valueChanges()
      .subscribe((data: any[]) => {
        if (data.length > 0) {
          this.directors = data[0]; // Guardar el director autenticado
          console.log('Director autenticado:', this.directors);
        } else {
          console.warn('No se encontró director para el email:', email);
        }
      });
  }

  cargarPlazas(email: string): void {
    this.firestore
      .collection('directors', (ref) => ref.where('email', '==', email))
      .get()
      .subscribe((directorSnapshot) => {
        if (!directorSnapshot.empty) {
          const directors = directorSnapshot.docs[0].data() as { id: string };
          this.plazas$ = this.firestore
            .collection('plazas', (ref) =>
              ref.where('directorsId', '==', directors.id)
            )
            .snapshotChanges()
            .pipe(
              map((actions) =>
                actions.map((action) => {
                  const data = action.payload.doc.data() as any;
                  const id = action.payload.doc.id;
                  return {
                    ...data,
                    id,
                    totalPostulantes: data.postulant
                      ? data.postulant.length
                      : 0, // Calcular el total de postulantes
                  };
                })
              )
            );
        }
      });
  }


  toggleModal(plaza?: any): void {
    this.isModalOpen = !this.isModalOpen;
    if (plaza) {
      this.selectedPlaza = plaza;
      this.form.patchValue(plaza);
    } else {
      this.selectedPlaza = null;
      this.form.reset();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.selectedPlaza) {
        this.editarPlaza();
      } else {
        this.guardarDatos();
      }
      this.toggleModal();
    } else {
      console.log('Formulario no válido');
    }
  }

  guardarDatos(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      const subject = formData.subject;
      const parallel = formData.parallel;
      const periodID = this.activePeriod ? this.activePeriod.id : null;

      // Verificar duplicados antes de guardar
      this.firestore
        .collection('plazas', (ref) =>
          ref
            .where('subject', '==', subject)
            .where('parallel', '==', parallel)
            .where('periodID', '==', periodID)
        )
        .get()
        .subscribe((snapshot) => {
          if (!snapshot.empty) {
            console.error(
              'Ya existe una plaza con la misma career, parallel y period.'
            );
          } else {
            // Crear plaza
            const plazaID = this.firestore.createId();
            this.firestore
              .collection('plazas')
              .doc(plazaID)
              .set({
                id: plazaID,
                ...formData,
                periodID: periodID,
                directorsId: this.directors?.id || null,
                directorsName: this.directors?.name || null,
                career: this.directors?.career || null,
                faculty: this.directors?.faculty || null,
                modality: this.directors?.modality || null,
                postulant: [], // Inicializar como un arreglo vacío
              })
              .then(() => {
                console.log('Plaza creada exitosamente.');
                this.form.reset();
              })
              .catch((error) => {
                console.error('Error al guardar en Firebase:', error);
              });
          }
        });
    }
  }

  cargarCiclos() {
    this.firestore.collection('academicCycles').valueChanges().subscribe((data: any[]) => {
      this.academicCycles = data
        .map(item => item.name)
        .sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, ''), 10);
          const numB = parseInt(b.replace(/\D/g, ''), 10);
          return numA - numB;
        });
    });
  }


  editarPlaza(): void {
    const formData = this.form.value;
    this.firestore
      .collection('plazas')
      .doc(this.selectedPlaza.id)
      .update({
        ...formData,
        postulant: this.selectedPlaza.postulant || [], // Mantener postulantes existentes
      })
      .then(() => {
        console.log('Plaza actualizada exitosamente en Firebase.');
        this.form.reset();
      })
      .catch((error) => {
        console.error('Error al actualizar en Firebase:', error);
      });
  }


  eliminarPlaza(id: string): void {
    this.firestore
      .collection('plazas')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Plaza eliminada exitosamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar la plaza:', error);
      });
  }
}
