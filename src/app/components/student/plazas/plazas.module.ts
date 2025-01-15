import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlazasRoutingModule } from './plazas-routing.module';
import { PlazasComponent } from './plazas.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    PlazasComponent
  ],
  imports: [
    CommonModule,
    PlazasRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class PlazasModule { }
