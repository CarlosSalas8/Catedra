import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';
import { arrayUnion } from 'firebase/firestore';

@Component({
  selector: 'app-plazas',
  templateUrl: './plazas.component.html',
  styleUrls: ['./plazas.component.css']
})
export class PlazasComponent implements OnInit {
  form!: FormGroup;
  activePeriod: any | null = null;
  periodoActivo: any;
  periodos: Observable<any[]> | undefined;
  plazas$: Observable<any[]> | undefined;
  carreraUsuario: string | null = null;
  isModalOpen: boolean = false;
  selectedPlaza: any | null = null;
  usuarioLogueado: any | null = null;
  userName: string = '';
  showAlert: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';
  academicCycles: string[] = [];

  constructor(public periodoService: PeriodoService, private firestore: AngularFirestore, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    // Obtener la career seleccionada por el usuario desde la colección 'users'
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.firestore.collection('users').doc(user.uid).get().subscribe(doc => {
          this.carreraUsuario = doc.get('career');
          this.filtrarPlazas();
        });
      }
    });

    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userName = user.displayName || 'Nombre no disponible'; // Asumiendo que el nombre está en displayName
      }
    });

    this.cargarCiclos();



    // Suscribirse al período activo
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    this.authService.getCurrentUser4().subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });

    this.form = this.fb.group({
      phone: ['', Validators.required],
      academicCycle: ['', Validators.required],
    });
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
  

  filtrarPlazas() {
    if (this.activePeriod) {
      // Filtrar las plazas que coincidan con el período activo
      this.plazas$ = this.firestore.collection('plazas', ref =>
        ref.where('periodID', '==', this.activePeriod.id)
          .where('career', '==', this.carreraUsuario) // Filtra también por la carrera del usuario, si es necesario
      ).valueChanges();
    }
  }

  toggleModal(plaza?: any): void {
    this.isModalOpen = !this.isModalOpen;
    this.selectedPlaza = plaza || null;
    if (!this.isModalOpen) {
      this.form.reset(); // Reinicia el formulario al cerrar el modal
    }
  }

  onSubmit(plazaID: string): void {
    if (this.form.valid) {
      this.guardarDatos(plazaID);
      this.toggleModal(); // Cierra el modal tras guardar
    }
  }

  guardarDatos(plazaID: string): void {
    if (this.form.valid) {
      const formData = this.form.value;

      // Verificar si el usuario ya ha postulado a esta plaza
      this.firestore.collection('postulant', ref =>
        ref.where('plazaID', '==', plazaID)
          .where('usuario.userID', '==', this.usuarioLogueado?.userID)
      ).get().subscribe(querySnapshot => {
        if (querySnapshot.empty) {
          // Generar un nuevo ID para la postulación
          const postId = this.firestore.createId();

          // Crear el objeto base de la postulación
          const postulacion = {
            id: postId,
            ...formData,
            periodID: this.activePeriod ? this.activePeriod.id : null,
            plazaID: plazaID,
          };

          // Recuperar información completa del usuario
          this.firestore
            .collection('users')
            .doc(this.usuarioLogueado?.userID)
            .get()
            .subscribe((userDoc) => {
              const usuarioInfo = userDoc.data();

              if (usuarioInfo) {
                const postulanteData = {
                  ...postulacion,
                  usuario: usuarioInfo, // Adjuntar información completa del usuario
                };

                // Guardar la postulación en la colección 'postulant'
                this.firestore
                  .collection('postulant')
                  .doc(postId)
                  .set(postulanteData)
                  .then(() => {
                   

                    // Actualizar el array de postulant en la plaza
                    this.actualizarPostulantesPlaza(plazaID, postulanteData);

                    this.form.reset(); // Limpia el formulario
                    this.mostrarAlerta('success');

                  })
                  .catch((error) => {
                    console.error('Error al guardar la postulación:', error);
                    this.mostrarAlerta('error');
                  });
              } else {
                console.error('Error: Información del usuario no encontrada');
              }
            });
        } else {
          // El usuario ya ha postulado a esta plaza
          this.errorMessage = 'No está permitido enviar otra postulación a la misma plaza.';
          this.mostrarAlerta('error');
        }
      });
    }
  }

  actualizarPostulantesPlaza(plazaID: string, postulanteData: any): void {
    const plazaRef = this.firestore.collection('plazas').doc(plazaID);

    plazaRef
      .update({
        postulant: arrayUnion(postulanteData), // Añadir el objeto completo
      })
      .then(() => {
       
      })
      .catch((error) => {
        console.error('Error al actualizar la plaza:', error);
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
    }, 4000);
  }
}