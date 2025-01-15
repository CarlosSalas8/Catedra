import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VistaRoutingModule } from './vista-routing.module';
import { VistaComponent } from './vista.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    VistaComponent
  ],
  imports: [
    CommonModule,
    VistaRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class VistaModule { }
