import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeAyudanteRoutingModule } from './home-ayudante-routing.module';
import { HomeAyudanteComponent } from './home-ayudante.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    HomeAyudanteComponent
  ],
  imports: [
    CommonModule,
    HomeAyudanteRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class HomeAyudanteModule { }
