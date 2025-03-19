import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { LogIn } from 'lucide-angular';
import { AuthService } from 'src/app/services/auth.service';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.css']
})
export class ValidarComponent implements OnInit {
  activity: any;
  teacher: any;
  teacherId: string | null = null;
  validationMessage: string = '';
  activePeriod: any | null = null;
  files: any[] = [];  // Lista de archivos subidos

  user: any;

  constructor(private firestore: AngularFirestore, 
    public periodoService: PeriodoService, 
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.auth.getCurrentUser5();
    console.log(this.user);
    

    this.periodoService.activePeriod$.subscribe(period => {
      this.activePeriod = period;
    });

    const actividadId = this.route.snapshot.paramMap.get('actividadId');
    if (actividadId) {
      this.firestore.collection('activities').doc(actividadId).valueChanges().subscribe(actividadData => {
        this.activity = actividadData;
      });
    }
    if (actividadId) {
      this.firestore.collection('activities').doc(actividadId).valueChanges().subscribe((data: any) => {
        this.activity = data;
        this.loadFiles(); // Cargar los archivos relacionados con la actividad
      });
    }
    
    this.route.paramMap.subscribe(params => {
      this.teacherId = params.get('id'); // Obtener el id del teacher de los parámetros de la ruta
      if (this.teacherId) {
        this.firestore.collection('teachers').doc(this.teacherId).valueChanges().subscribe(teacherData => {
          this.teacher = teacherData;
        });
      }
    });

  }

  loadFiles() {
    if (!this.activity || !this.activity.id) return;
    const filePath = `actividades/${this.activity.id}/`;
  
    this.files = []; 
  
    this.storage.ref(filePath).listAll().subscribe(result => {
      result.items.forEach(item => {
        item.getDownloadURL().then(url => {
          // Verificar si el archivo ya está en la lista para evitar duplicados
          if (!this.files.some(file => file.url === url)) {
            this.files.push({ name: item.name, url: url });
          }
        });
      });
    });
  }
  
  // Seleccionar archivo para abrirlo en una nueva pestaña
  selectFile(fileUrl: string) {
    window.open(fileUrl, '_blank');
  }

  validateActivity(isValid: boolean): void {
    if (this.activity) {
      const activityId = this.route.snapshot.paramMap.get('actividadId');
      if (activityId) {
        this.firestore.collection('activities').doc(activityId).update({
          validated: isValid
        });
      }
    }
  }
}