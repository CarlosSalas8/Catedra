import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformeRoutingModule } from './informe-routing.module';
import { InformeComponent } from './informe.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    InformeComponent
  ],
  imports: [
    CommonModule,
    InformeRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class InformeModule { }
