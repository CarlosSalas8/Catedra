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
import { ReactiveFormsModule } from '@angular/forms';
import { HomeDocenteComponent } from './components/docente/home-docente/home-docente.component';
import { SeguimientoDocenteComponent } from './components/docente/seguimiento-docente/seguimiento-docente.component';
import { NavbarTeacherModule } from "./components/navbars/navbar-teacher/navbar-teacher.module";
import { AsideTeachersModule } from "./components/asides/aside-teachers/aside-teachers.module";
import { ActividadesDocentesComponent } from './components/docente/actividades-docentes/actividades-docentes.component';
import { ValidarComponent } from './components/docente/validar/validar.component';
import { HomeComponent } from './components/home/home/home.component';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeDocenteComponent,
    SeguimientoDocenteComponent,
    ActividadesDocentesComponent,
    ValidarComponent
    
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
    NavbarTeacherModule,
    AsideTeachersModule
],
  
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
