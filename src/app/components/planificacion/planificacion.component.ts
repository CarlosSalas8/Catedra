import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-planificacion',
  templateUrl: './planificacion.component.html',
  styleUrls: ['./planificacion.component.css']
})
export class PlanificacionComponent implements OnInit {

  form: FormGroup;



  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private router: Router) {
    this.form = this.fb.group({
      docente: ['', Validators.required],
      ayudante: ['', Validators.required],
      facultad: ['', Validators.required],
      carrera: ['', Validators.required],
      asignatura: ['', Validators.required],
      modalidad: ['', Validators.required],
      items: this.fb.array([]),
      itemsSegundo: this.fb.array([]),
      itemsRecuperacion: this.fb.array([])

    });

  }


  ngOnInit(): void {
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

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemsSegundo(): FormArray {
    return this.form.get('itemsSegundo') as FormArray;
  }

  get itemsRecuperacion(): FormArray {
    return this.form.get('itemsRecuperacion') as FormArray;
  }

  removeItems(index: number): void {
    this.items.removeAt(index);
  }

  removeItemsSegundo(index: number): void {
    this.itemsSegundo.removeAt(index);
  }

  removeItemsRecuperacion(index: number): void {
    this.itemsRecuperacion.removeAt(index);
  }

  addItems(): void {
    this.items.push(this.createItem());
  }

  addItemsSegundo(): void {
    this.itemsSegundo.push(this.createItem());
  }

  addItemsRecuperacion(): void {
    this.itemsRecuperacion.push(this.createItem());
  }



  createItem(): FormGroup {
    return this.fb.group({
      actividad: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      medioVerificacion: ['', Validators.required]
    });
  }



  guardarDatos() {
    if (this.form.valid) {
      const formData = this.form.value;
  
      const generalData = {
        docente: formData.docente,
        ayudante: formData.ayudante,
        facultad: formData.facultad,
        carrera: formData.carrera,
        asignatura: formData.asignatura,
        modalidad: formData.modalidad
      };
  
      const batch = this.firestore.firestore.batch();
  
      formData.items.forEach((item: any) => {
        const newDocRef = this.firestore.collection('items').doc().ref;
        batch.set(newDocRef, { id: newDocRef.id, ...generalData, ...item, tipo: 'primer_bimestre' });
      });
  
      formData.itemsSegundo.forEach((item: any) => {
        const newDocRef = this.firestore.collection('items').doc().ref;
        batch.set(newDocRef, { id: newDocRef.id, ...generalData, ...item, tipo: 'segundo_bimestre' });
      });
  
      formData.itemsRecuperacion.forEach((item: any) => {
        const newDocRef = this.firestore.collection('items').doc().ref;
        batch.set(newDocRef, { id: newDocRef.id, ...generalData, ...item, tipo: 'recuperacion' });
      });
  
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
    } else {
      alert('Por favor, completa todos los campos del formulario.');
    }
  }
  
  

  // Métodos para obtener los controles específicos del Primer Bimestre
  getActividadControl(index: number): FormControl {
    return this.items.at(index).get('actividad') as FormControl;
  }

  getFechaInicioControl(index: number): FormControl {
    return this.items.at(index).get('fechaInicio') as FormControl;
  }

  getFechaFinControl(index: number): FormControl {
    return this.items.at(index).get('fechaFin') as FormControl;
  }

  getMedioVerificacionControl(index: number): FormControl {
    return this.items.at(index).get('medioVerificacion') as FormControl;
  }

  // Métodos para obtener los controles específicos del Segundo Bimestre
  getActividadSegundoControl(index: number): FormControl {
    return this.itemsSegundo.at(index).get('actividad') as FormControl;
  }

  getFechaInicioSegundoControl(index: number): FormControl {
    return this.itemsSegundo.at(index).get('fechaInicio') as FormControl;
  }

  getFechaFinSegundoControl(index: number): FormControl {
    return this.itemsSegundo.at(index).get('fechaFin') as FormControl;
  }

  getMedioVerificacionSegundoControl(index: number): FormControl {
    return this.itemsSegundo.at(index).get('medioVerificacion') as FormControl;
  }

  // Métodos para obtener los controles específicos de la Recuperación
  getActividadRecuperacionControl(index: number): FormControl {
    return this.itemsRecuperacion.at(index).get('actividad') as FormControl;
  }

  getFechaInicioRecuperacionControl(index: number): FormControl {
    return this.itemsRecuperacion.at(index).get('fechaInicio') as FormControl;
  }

  getFechaFinRecuperacionControl(index: number): FormControl {
    return this.itemsRecuperacion.at(index).get('fechaFin') as FormControl;
  }

  getMedioVerificacionRecuperacionControl(index: number): FormControl {
    return this.itemsRecuperacion.at(index).get('medioVerificacion') as FormControl;
  }
}
