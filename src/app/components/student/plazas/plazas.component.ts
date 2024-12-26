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



  constructor(public periodoService: PeriodoService, private firestore: AngularFirestore, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    // Obtener la asignatura seleccionada por el usuario desde la colección 'usuarios'
    this.authService.getCurrentUser2().subscribe(user => {
      if (user) {
        this.firestore.collection('usuarios').doc(user.uid).get().subscribe(doc => {
          this.carreraUsuario = doc.get('asignatura');
          this.filtrarPlazas();
        });
      }
    });

    // Suscribirse al período activo
    this.periodoService.activePeriod$.subscribe(periodo => {
      this.activePeriod = periodo;
    });

    this.authService.getCurrentUser4().subscribe((usuario) => {
      this.usuarioLogueado = usuario;
    });

    this.form = this.fb.group({
      phone: ['', Validators.required],
      ciclo: ['', Validators.required],
    });

    this.setupMobileMenuToggle();
  }

  filtrarPlazas() {
    // Filtrar las plazas según la carrera seleccionada por el usuario
    this.plazas$ = this.firestore.collection('plazas', ref =>
      ref.where('asignatura', '==', this.carreraUsuario)
    ).valueChanges();
  }

  toggleModal(plaza?: any): void {
    this.isModalOpen = !this.isModalOpen;
    this.selectedPlaza = plaza || null;
    if (!this.isModalOpen) {
      this.form.reset(); // Reinicia el formulario al cerrar el modal
    }
  }


  onSubmit(plazaId: string): void {
    if (this.form.valid) {
      this.guardarDatos(plazaId);
      this.toggleModal(); // Cierra el modal tras guardar
    } else {
      console.log('Formulario no válido');
    }
  }

  guardarDatos(plazaId: string): void {
    if (this.form.valid) {
      const formData = this.form.value;
  
      // Generar un nuevo ID para la postulación
      const postId = this.firestore.createId();
  
      // Crear el objeto base de la postulación
      const postulacion = {
        id: postId,
        ...formData,
        periodoId: this.activePeriod ? this.activePeriod.id : null,
        plazaId: plazaId,
      };
  
      // Recuperar información completa del usuario
      this.firestore
        .collection('usuarios')
        .doc(this.usuarioLogueado?.usuarioId)
        .get()
        .subscribe((userDoc) => {
          const usuarioInfo = userDoc.data();
  
          if (usuarioInfo) {
            const postulanteData = {
              ...postulacion,
              usuario: usuarioInfo, // Adjuntar información completa del usuario
            };
  
            // Guardar la postulación en la colección 'postulantes'
            this.firestore
              .collection('postulantes')
              .doc(postId)
              .set(postulanteData)
              .then(() => {
                console.log('Postulación guardada exitosamente:', postulanteData);
  
                // Actualizar el array de postulantes en la plaza
                this.actualizarPostulantesPlaza(plazaId, postulanteData);
                this.form.reset(); // Limpia el formulario
              })
              .catch((error) => {
                console.error('Error al guardar la postulación:', error);
              });
          } else {
            console.error('Error: Información del usuario no encontrada');
          }
        });
    }
  }
  

  actualizarPostulantesPlaza(plazaId: string, postulanteData: any): void {
    const plazaRef = this.firestore.collection('plazas').doc(plazaId);

    plazaRef
      .update({
        postulantes: arrayUnion(postulanteData), // Añadir el objeto completo
      })
      .then(() => {
        console.log(`Información de postulación añadida a la plaza ${plazaId}`);
      })
      .catch((error) => {
        console.error('Error al actualizar la plaza:', error);
      });
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
