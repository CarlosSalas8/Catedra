import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-crear-plaza',
  templateUrl: './crear-plaza.component.html',
  styleUrls: ['./crear-plaza.component.css']
})
export class CrearPlazaComponent implements OnInit {

  form: FormGroup;
  activePeriod: any | null = null;
  periodoActivo: any;
  periodos: Observable<any[]> | undefined;
  isModalOpen: boolean = false;
  totalPostulantes: number = 0; // Contador de plazas 
  selectedPlaza: any | null = null;

  plazas$: Observable<any[]> | undefined;

  constructor(public periodoService: PeriodoService, private fb: FormBuilder, private firestore: AngularFirestore, private router: Router) {
    this.form = this.fb.group({
      asignatura: ['', Validators.required],
      docente: ['', Validators.required],
      correo: ['', Validators.required],
      paralelo: ['', Validators.required],
      malla: ['', Validators.required],
      ciclo: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.plazas$ = this.firestore.collection('plazas').valueChanges();

    this.periodoService.activePeriod$.subscribe(periodo => {
      this.activePeriod = periodo;
    });
    this.setupMobileMenuToggle();
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

  toggleModal(plaza?: any): void {
    this.isModalOpen = !this.isModalOpen;
    if (plaza) {
      console.log('Plaza seleccionada para editar:', plaza); // Agrega esta línea para depuración
      this.selectedPlaza = plaza;
      this.form.patchValue(plaza); // Carga la plaza seleccionada en el formulario
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
      this.toggleModal(); // Cierra el modal al enviar el formulario
    } else {
      console.log('Formulario no válido');
    }
  }


  guardarDatos(): void {
    if (this.form.valid) {
      const formData = this.form.value;

      // Generate a new document ID
      const plazaId = this.firestore.createId();

      // Use the generated ID to add the plaza
      this.firestore.collection('plazas').doc(plazaId).set({
        id: plazaId, // Include the generated ID in the document
        ...formData,
        periodo: this.activePeriod ? this.activePeriod.id : null
      }).then(() => {
        console.log('Plaza guardada exitosamente en Firebase con ID:', plazaId);
        this.form.reset(); // Limpia el formulario tras guardar
      }).catch(error => {
        console.error('Error al guardar en Firebase:', error);
      });
    }
  }



  editarPlaza(): void {
    const formData = this.form.value;
    this.firestore.collection('plazas').doc(this.selectedPlaza.id).update(formData)
      .then(() => {
        console.log('Plaza actualizada exitosamente en Firebase');
        this.form.reset();
      })
      .catch(error => {
        console.error('Error al actualizar en Firebase:', error);
      });
  }

  eliminarPlaza(id: string): void {
    console.log('Eliminando plaza con ID:', id); // Verifica que el ID sea correcto
    this.firestore.collection('plazas').doc(id).delete()
      .then(() => {
        console.log('Plaza eliminada exitosamente de Firebase');
      })
      .catch(error => {
        console.error('Error al eliminar de Firebase:', error);
      });
  }






}
