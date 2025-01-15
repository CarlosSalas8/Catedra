import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { PlanificacionComponent } from './planificacion.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    PlanificacionComponent
  ],
  imports: [
    CommonModule,
    PlanificacionRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class PlanificacionModule { }
