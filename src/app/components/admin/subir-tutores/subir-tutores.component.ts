import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-subir-tutores',
  templateUrl: './subir-tutores.component.html',
  styleUrls: ['./subir-tutores.component.css']
})
export class SubirTutoresComponent implements OnInit {
  activePeriod: any | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(public periodoService: PeriodoService, private afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        delimiter: ',', // Asegúrate de que este sea el delimitador correcto
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          // this.uploadDataToFirebase(data); // No lo llamamos directamente aquí
        }
      });
    }
  }

  uploadData() {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.isLoading = true; // Mostrar indicador de carga
      Papa.parse(file, {
        header: true,
        delimiter: ',', // Asegúrate de que este sea el delimitador correcto
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          if (this.validateFormat(data)) {
            this.uploadDataToFirebase(data); // Llamamos a la carga de datos si pasa la validación
          } else {
            this.errorMessage = 'El archivo CSV no cumple con el formato requerido.';
            this.isLoading = false; // Ocultar indicador de carga
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo CSV', error);
          this.errorMessage = 'Error al analizar el archivo CSV.';
          this.isLoading = false; // Ocultar indicador de carga
        }
      });
    } else {
      this.errorMessage = 'Por favor seleccione un archivo CSV.';
    }
  }

  validateFormat(data: any[]): boolean {
    const requiredHeaders = ['email', 'name', 'career', 'role', 'faculty', 'modality', 'subject'];

    // Verificar que todas las filas tengan las columnas requeridas
    for (const row of data) {
      for (const header of requiredHeaders) {
        if (!(header in row)) {
          return false;
        }
      }
    }

    return true;
  }

  async uploadDataToFirebase(data: any) {
    this.successMessage = ''; // Limpiamos mensajes anteriores
    this.errorMessage = '';

    try {
      // Usamos Promise.all para asegurar que todas las operaciones de guardado se completen antes de mostrar un mensaje
      await Promise.all(
        data.map(async (directors: any) => {
          const docRef = this.firestore.collection('directors').doc();
          const id = docRef.ref.id;
          directors.id = id; // Añadir el ID al documento
          directors.periodID = this.activePeriod.id;
          await docRef.set(directors); // Crear el documento con el ID y los datos
        })
      );
      this.successMessage = 'Archivo CSV subido correctamente.';
    } catch (error) {
      console.error('Error al subir datos a Firestore', error);
      this.errorMessage = 'Error al subir datos a Firestore.';
    } finally {
      this.isLoading = false; // Ocultar indicador de carga
    }
  }


}
