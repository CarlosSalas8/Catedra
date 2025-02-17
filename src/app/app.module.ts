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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { VentanasComponent } from './components/home/ventanas/ventanas.component';
import { CarreraComponent } from './components/home/carrera/carrera.component';
import { HomeAyudanteComponent } from './components/student/home-ayudante/home-ayudante.component';
import { AsideStudentComponent } from './components/asides/aside-student/aside-student.component';
import { NavbarStudentComponent } from './components/navbars/navbar-student/navbar-student.component';
import { InformeComponent } from './components/student/informe/informe.component';
import { PlanificacionComponent } from './components/student/planificacion/planificacion.component';
import { VistaComponent } from './components/student/vista/vista.component';
import { PlazasComponent } from './components/student/plazas/plazas.component';
import { PresentacionComponent } from './components/student/presentacion/presentacion.component';
import { RevisarComponent } from './components/student/revisar/revisar.component';
import { AsideAdminComponent } from './components/asides/aside-admin/aside-admin.component';
import { NavbarAdminComponent } from './components/navbars/navbar-admin/navbar-admin.component';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { InformeAdminComponent } from './components/admin/informe-admin/informe-admin.component';
import { SeguimientoComponent } from './components/admin/seguimiento/seguimiento.component';
import { SubirTutoresComponent } from './components/admin/subir-tutores/subir-tutores.component';
import { SubmitComponent } from './components/admin/submit/submit.component';
import { AsideDirectorsComponent } from './components/asides/aside-directors/aside-directors.component';
import { NavbarDirectorsComponent } from './components/navbars/navbar-directors/navbar-directors.component';
import { CrearPlazaComponent } from './components/director/crear-plaza/crear-plaza.component';
import { SeguimientoDirectorComponent } from './components/director/seguimiento-director/seguimiento-director.component';
import { HomeDirectorComponent } from './components/director/home-director/home-director.component';
import { InformeDirectorComponent } from './components/director/informe-director/informe-director.component';
import { PostulantesComponent } from './components/director/postulantes/postulantes.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VentanasComponent,
    CarreraComponent,
    HomeAyudanteComponent,
    AsideStudentComponent,
    NavbarStudentComponent, 
    InformeComponent,
    PlanificacionComponent,
    VistaComponent,
    PlazasComponent, 
    PresentacionComponent,
    RevisarComponent,
    AsideAdminComponent,
    NavbarAdminComponent, 
    HomeAdminComponent,
    InformeAdminComponent,
    SeguimientoComponent,
    SubirTutoresComponent,
    SubmitComponent,
    AsideDirectorsComponent,
    NavbarDirectorsComponent,
    CrearPlazaComponent,
    SeguimientoDirectorComponent,
    HomeDirectorComponent,
    InformeDirectorComponent, 
    PostulantesComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    SharedModule,
    HttpClientModule,
    FormsModule
  ],

  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
