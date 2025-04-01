import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PeriodoService } from 'src/app/services/periodo.service';
import { EmailService } from 'src/app/services/email.service';

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

  constructor(
    public periodoService: PeriodoService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private emailService: EmailService
  ) {}

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
        delimiter: ',',
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
      this.isLoading = true;
      Papa.parse(file, {
        header: true,
        delimiter: ',',
        skipEmptyLines: true,
        complete: async (result) => {
          const data = result.data;
          if (this.validateFormat(data)) {
            await this.uploadDataToFirebase(data);
          } else {
            this.errorMessage = 'El archivo CSV no cumple con el formato requerido.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error al analizar el archivo CSV', error);
          this.errorMessage = 'Error al analizar el archivo CSV.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor seleccione un archivo CSV.';
    }
  }

  validateFormat(data: any[]): boolean {
    const requiredHeaders = ['email', 'name', 'career', 'role'];
    
    for (const row of data) {
      for (const header of requiredHeaders) {
        if (!(header in row)) {
          console.log(`Falta el campo ${header} en el archivo CSV`);
          
          return false;
        }
      }
    }

    return true;
  }

  async uploadDataToFirebase(data: any) {
    this.successMessage = '';
    this.errorMessage = '';
  
    try {
      await Promise.all(
        data.map(async (director: any) => {
          const careerDoc = await this.firestore
            .collection('careers', ref => ref.where('name', '==', director.career))
            .get()
            .toPromise();
  
          if (careerDoc && !careerDoc.empty) {
            const careerData = careerDoc.docs[0].data() as { id?: string; facultyId?: string; facultyName?: string; modality?: string };
  
            director.careerId = careerData.id || ''; // Asignamos el ID de la carrera
            director.faculty = careerData.facultyName || ''; // Usamos facultyName porque así está en Firestore
            director.facultyId = careerData.facultyId || ''; // Si necesitas el ID de la facultad
            director.modality = careerData.modality || '';
          } else {
            console.warn(`No se encontró la carrera: ${director.career}`);
          }
  
          const docRef = this.firestore.collection('directors').doc();
          director.id = docRef.ref.id;
          director.periodID = this.activePeriod.id;
          await docRef.set(director);

          // Buscar el usuario por email
          const userDoc = await this.firestore
            .collection('users', ref => ref.where('email', '==', director.email))
            .get()
            .toPromise();

          if (userDoc && !userDoc.empty) {
            const userData = userDoc.docs[0].data() as { id: string; role: string; career: string; validated: boolean };
            await this.firestore.collection('users').doc(userData.id).update({ role: 'director', periodID: this.activePeriod.id });	
          }
        })
      );
      this.successMessage = 'Archivo CSV subido correctamente.';
    } catch (error) {
      console.error('Error al subir datos a la Base de Datos', error);
      this.errorMessage = 'Error al subir datos a la Base de Datos.';
    } finally {
      this.isLoading = false;
    }
  }

  // Llamar a la call function para enviar correos
  enviarCorreos() {
    console.log(this.emailService.sendEmail());
  }
}
