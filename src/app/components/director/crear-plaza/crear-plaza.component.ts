import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  role: string | null = null;
  email!: string;

  selectedCareer: string = '';
  orderSubject: 'asc' | 'desc' = 'asc';	
  orderDocentes: 'asc' | 'desc' = 'asc';

  careers: any[] = [];

  showAlert: boolean = false;
  showError: boolean = false;
  showAlertDelete: boolean = false;
  errorMessage: string = '';

  constructor(
    public periodoService: PeriodoService,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      nameTeacher: new FormControl('', [Validators.required, Validators.minLength(3)]),
      emailTeacher: new FormControl('', [Validators.required, Validators.email]),
      parallel: ['', Validators.required],
      curriculum: ['', Validators.required],
      academicCycle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchData('careers');
    
    // Cargar plazas asociadas al usuario autenticado
    this.auth.user.subscribe((user) => {
      if (user && user.uid) {
        this.email = user.email!;
        this.getDirectorAutenticado(user.email!);
        this.cargarPlazas(user.email!);
      }
    });

    // Suscribirse al período status 
    this.periodoService.activePeriod$.subscribe((period) => {
      this.activePeriod = period;
    });

    this.cargarCiclos();
    this.cargarMallas();

    this.authService.getCurrentUserRole().subscribe(role => {
      this.role = role;  // Asumes que 'role' es el rol del usuario logueado
    });

  }

  sortPlazas() {
    // this.filterByCareer();
    this.cargarPlazas(this.email);
  }

  sortDocentes() {
    this.cargarPlazas(this.email);
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
          
        } else {
          console.warn('No se encontró director para el email:', email);
        }
      });
  }

  cargarPlazas(email: string): void {
    if (this.role === 'director') {
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
    } else {
      this.plazas$ = this.firestore
        .collection('plazas', (ref) => {
          if (this.selectedCareer === '') {
            return ref.orderBy('subject', this.orderSubject)
                      .orderBy('parallel', 'asc')
                      .orderBy('nameTeacher', this.orderDocentes);
          }
          
          return ref.where('career', '==', this.selectedCareer)
                    .orderBy('subject', this.orderSubject)
                    .orderBy('parallel', 'asc')
                    .orderBy('nameTeacher', this.orderDocentes);
        })
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
      this.errorMessage = 'Por favor, complete de manera correcta todos los campos.';
      this.mostrarAlerta('error');
    }
  }

  guardarDatos(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      // poner en mayúsculas los campos de texto
      formData.subject = formData.subject.toUpperCase();
      formData.parallel = formData.parallel.toUpperCase();
      formData.nameTeacher = formData.nameTeacher.toUpperCase();
      formData.emailTeacher = formData.emailTeacher.toLowerCase();

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
            .where('emailTeacher', '==', formData.emailTeacher)
        )
        .get()
        .subscribe((snapshot) => {
          if (!snapshot.empty) {
            console.error(
              'Ya existe una plaza con la misma Carrera, Paralelo y Periodo.'
            );
          } else {
            // Crear plaza
            this.firestore.collection("users", ref => ref.where("email", "==", formData.emailTeacher)).get()
            .subscribe((docente) => {
              let docenteData: any = null;
              if (docente.empty) {
                docenteData = {};
                console.error('No se encontró docente con el email:', formData.emailTeacher);
              } else {	
                docenteData = docente.docs[0].data() as any;
              }


              const plazaID = this.firestore.createId();
              this.firestore
                .collection('plazas')
                .doc(plazaID)
                .set({
                  id: plazaID,
                  ...formData,
                  nameTeacher: docenteData.name ||  formData.nameTeacher.toUpperCase(),
                  teacherId: docenteData.id || null,
                  teacherEmail: formData.emailTeacher,
                  periodID: periodID,
                  directorsId: this.directors?.id || null,
                  directorsName: this.directors?.name || null,
                  emailDirector: this.directors?.email || null,
                  career: this.directors?.career || null,
                  faculty: this.directors?.faculty || null,
                  modality: this.directors?.modality || null,
                  postulant: [], // Inicializar como un arreglo vacío
                })
                .then(() => {
                  const id = this.firestore.createId();

                  // Guardar en la colección de docentes
                  this.firestore.collection('teachers').doc(id).set({
                    id: id,
                    name: docenteData.name || formData.nameTeacher,
                    email: formData.emailTeacher,
                    plaza: plazaID,
                    emailDirector: this.directors?.email || null,
                    parallel: formData.parallel,
                    subject: formData.subject,
                    career: this.directors?.career || null,
                    faculty: this.directors?.faculty || null,
                    modality: this.directors?.modality || null,
                    periodID: periodID,
                  });

                  this.form.reset();
                })
                .catch((error) => {
                  console.error('Error al guardar en Firebase:', error);
                });
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
        
        this.form.reset();
      })
      .catch((error) => {
        console.error('Error al actualizar en Firebase:', error);
      });
  }


  eliminarPlaza(id: string): void {
    if (!confirm('¿Estás seguro de eliminar esta plaza?')) return; // Si el usuario cancela,
    
    this.firestore
      .collection('plazas')
      .doc(id)
      .delete()
      .then(() => {  
        alert('Plaza eliminada correctamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar la plaza:', error);
        alert('Error al eliminar la plaza.');
      })
      .finally(() => {
        this.toggleAlertDelete();
      });
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
    }, 1000);
  }

  fetchData(collection: string): void {
    this.firestore.collection(collection).snapshotChanges().subscribe((data: any) => {
      let result = data.map((doc: any) => ({
        id: doc.payload.doc.id,
        ...doc.payload.doc.data()
      }));

      // if (collection === 'academicCycles') {
      //   this.academicCycles = result.sort((a: { name: string; }, b: { name: string; }) => {
      //     const numA = parseInt(a.name.replace(/\D/g, ''), 10);
      //     const numB = parseInt(b.name.replace(/\D/g, ''), 10);
      //     return numA - numB;
      //   });
      // } else 
      if (collection === 'careers') {
        this.careers = result;
      } 
      // else if (collection === 'faculties') {
      //   this.faculties = result;
      // } else if (collection === 'curriculums') {
      //   this.curriculums = result;
      // }
    });
  }

  toggleAlertDelete(): void {
    this.showAlertDelete = !this.showAlertDelete;
  }
}
