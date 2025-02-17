import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeDocenteComponent } from '../docente/home-docente/home-docente.component';
import { SeguimientoDocenteComponent } from '../docente/seguimiento-docente/seguimiento-docente.component';
import { ActividadesDocentesComponent } from '../docente/actividades-docentes/actividades-docentes.component';
import { ValidarComponent } from '../docente/validar/validar.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { NavbarTeacherComponent } from '../navbars/navbar-teacher/navbar-teacher.component';
import { AsideTeachersComponent } from '../asides/aside-teachers/aside-teachers.component';
import { InformeDocenteComponent } from '../docente/informe-docente/informe-docente.component';






@NgModule({
  declarations: [
    HomeComponent,
    InformeDocenteComponent,
    HomeDocenteComponent,
    SeguimientoDocenteComponent,
    ActividadesDocentesComponent,
    ValidarComponent,
    NavbarTeacherComponent,
    AsideTeachersComponent,

    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule 
  ],
  exports:[
    CommonModule,
    ReactiveFormsModule,
    HomeComponent,
    InformeDocenteComponent,
    HomeDocenteComponent,
    SeguimientoDocenteComponent,
    ActividadesDocentesComponent,
    ValidarComponent,
    NavbarTeacherComponent,
    AsideTeachersComponent,

    
    
  ]
})
export class SharedModule { }
