import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { SharedModule } from './components/shared/shared.module';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { InformeComponent } from './components/student/informe/informe.component';
import { PlanificacionComponent } from './components/student/planificacion/planificacion.component';
import { VistaComponent } from './components/student/vista/vista.component';
import { PlazasComponent } from './components/student/plazas/plazas.component';
import { PresentacionComponent } from './components/student/presentacion/presentacion.component';
import { RevisarComponent } from './components/student/revisar/revisar.component';

import { InformeAdminComponent } from './components/admin/informe-admin/informe-admin.component';
import { SeguimientoComponent } from './components/admin/seguimiento/seguimiento.component';
import { SubirTutoresComponent } from './components/admin/subir-tutores/subir-tutores.component';
import { SubmitComponent } from './components/admin/submit/submit.component';
import { CrearPlazaComponent } from './components/director/crear-plaza/crear-plaza.component';
import { SeguimientoDirectorComponent } from './components/director/seguimiento-director/seguimiento-director.component';
import { InformeDirectorComponent } from './components/director/informe-director/informe-director.component';
import { PostulantesComponent } from './components/director/postulantes/postulantes.component';
import { InformeDocenteComponent } from './components/docente/informe-docente/informe-docente.component';
import { SeguimientoDocenteComponent } from './components/docente/seguimiento-docente/seguimiento-docente.component';
import { ActividadesDocentesComponent } from './components/docente/actividades-docentes/actividades-docentes.component';
import { ValidarComponent } from './components/docente/validar/validar.component';

import { HomeModule } from './components/home/home/home.module';


@NgModule({
  declarations: [
    AppComponent,
    InformeComponent,
    PlanificacionComponent,
    VistaComponent,
    PlazasComponent,
    PresentacionComponent,
    RevisarComponent,
    InformeAdminComponent,
    SeguimientoComponent,
    SubirTutoresComponent,
    SubmitComponent,
    CrearPlazaComponent,
    SeguimientoDirectorComponent,
    InformeDirectorComponent,
    PostulantesComponent,
    InformeDocenteComponent,
    SeguimientoDocenteComponent,
    ActividadesDocentesComponent,
    ValidarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    SharedModule,
    HomeModule,
    HttpClientModule
  ],

  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
