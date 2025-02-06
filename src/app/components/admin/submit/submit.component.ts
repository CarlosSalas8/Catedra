import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css']
})
export class SubmitComponent implements OnInit {
  form: FormGroup;
  isModalOpen: boolean = false;
  modalType: 'career' | 'faculty' | 'curriculum' | 'academicCycle' | null = null;
  modalTitle: string = '';
  activePeriod: any | null = null;
  successMessage: string = '';
  errorMessage: string = '';
  currentEditId: string | null = null; // ID del elemento que se está editando

  careers: any[] = [];
  faculties: any[] = [];
  academicCycles: any[] = [];
  curriculums: any[] = [];

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    public periodoService: PeriodoService
  ) {
    this.form = this.fb.group({
      career: ['', Validators.required],
      faculty: ['', Validators.required],
      curriculum: ['', Validators.required],
      academicCycle: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    this.fetchData('careers');
    this.fetchData('faculties');
    this.fetchData('curriculums');
    this.fetchData('academicCycles');
  }

  fetchData(collection: string): void {
    this.firestore.collection(collection).snapshotChanges().subscribe((data: any) => {
      let result = data.map((doc: any) => ({
        id: doc.payload.doc.id,
        ...doc.payload.doc.data()
      }));
  
      if (collection === 'academicCycles') {
        this.academicCycles = result.sort((a: { name: string; }, b: { name: string; }) => {
          const numA = parseInt(a.name.replace(/\D/g, ''), 10);
          const numB = parseInt(b.name.replace(/\D/g, ''), 10);
          return numA - numB;
        });
      } else if (collection === 'careers') {
        this.careers = result;
      } else if (collection === 'faculties') {
        this.faculties = result;
      } else if (collection === 'curriculums') {
        this.curriculums = result;
      }
    });
  }
  

  toggleModal(type?: 'career' | 'faculty' | 'curriculum' | 'academicCycle'): void {
    this.isModalOpen = !!type;
    this.successMessage = '';
    this.errorMessage = '';
    this.currentEditId = null; // Limpiar ID de edición al abrir modal

    if (type) {
      this.modalType = type;
      this.modalTitle = this.getModalTitle(type);
      this.form.reset();
      this.form = this.fb.group({
        [type]: ['', Validators.required]
      });
    } else {
      this.modalType = null;
      this.modalTitle = '';
      this.form.reset();
    }
  }

  getModalTitle(type: string): string {
    switch (type) {
      case 'career': return 'Crear Carrera';
      case 'faculty': return 'Crear Facultad';
      case 'curriculum': return 'Crear Malla Curricular';
      case 'academicCycle': return 'Crear Ciclo Académico';
      default: return 'Crear Registro';
    }
  }

  submitData(): void {
    if (this.form.valid && this.modalType) {
      const data = this.form.value;
      const collectionMap = {
        'career': { collection: 'careers', value: data.career },
        'faculty': { collection: 'faculties', value: data.faculty },
        'curriculum': { collection: 'curriculums', value: data.curriculum },
        'academicCycle': { collection: 'academicCycles', value: data.academicCycle }
      };

      const selectedCollection = collectionMap[this.modalType];

      if (selectedCollection) {
        if (this.currentEditId) {
          // Si hay un ID, actualizamos
          this.updateInFirestore(selectedCollection.collection, this.currentEditId, { name: selectedCollection.value });
        } else {
          // Si no hay ID, creamos nuevo
          this.saveToFirestore(selectedCollection.collection, { name: selectedCollection.value });
        }
      }
    } else {
      this.errorMessage = 'Por favor, complete todos los campos.';
    }
  }

  saveToFirestore(collection: string, data: any): void {
    this.firestore.collection(collection).add(data)
      .then(() => {
        this.successMessage = `¡Guardado con éxito!`;
        this.errorMessage = '';
        this.form.reset();
        setTimeout(() => this.successMessage = '', 2000);
      })
      .catch(error => {
        this.errorMessage = `Error: ${error.message}`;
        this.successMessage = '';
      });
  }

  // Método para actualizar datos
  updateInFirestore(collection: string, id: string, data: any): void {
    this.firestore.collection(collection).doc(id).update(data)
      .then(() => {
        this.successMessage = '¡Actualizado con éxito!';
        this.errorMessage = '';
        this.form.reset();
        this.currentEditId = null;
        setTimeout(() => this.successMessage = '', 2000);
        this.toggleModal(); // Cierra el modal
      })
      
      .catch(error => {
        this.errorMessage = `Error al actualizar: ${error.message}`;
      });
  }

  // Método para iniciar la edición de un elemento
  editItem(type: 'career' | 'faculty' | 'curriculum' | 'academicCycle', item: any): void {
    this.toggleModal(type);
    this.currentEditId = item.id; // Guardar ID para la actualización
    this.form.patchValue({ [type]: item.name }); // Llenar formulario con datos existentes
  }

  // Método para eliminar un registro
  deleteItem(collection: string, id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      this.firestore.collection(collection).doc(id).delete()
        .then(() => {
          this.successMessage = '¡Eliminado con éxito!';
          setTimeout(() => this.successMessage = '', 2000);
        })
        .catch(error => {
          this.errorMessage = `Error al eliminar: ${error.message}`;
        });
    }
  }
}
