import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CarreraComponent } from '../carrera/carrera.component';
import { HomeAyudanteComponent } from '../../student/home-ayudante/home-ayudante.component';
import { SharedModule } from '../../../shared/shared.module';
import { HomeDocenteComponent } from '../../docente/home-docente/home-docente.component';
import { HomeDirectorComponent } from '../../director/home-director/home-director.component';
import { HomeAdminComponent } from '../../admin/home-admin/home-admin.component';
import { LoginComponent } from '../login/login.component';



@NgModule({
  declarations: [
    HomeComponent,
    CarreraComponent,
    LoginComponent,
    HomeAyudanteComponent,
    HomeDocenteComponent,
    HomeDirectorComponent,
    HomeAdminComponent

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule

  ]
})
export class HomeModule { }
