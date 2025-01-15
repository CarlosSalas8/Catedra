import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerInformeRoutingModule } from './ver-informe-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { VerInformeComponent } from './ver-informe.component';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    VerInformeComponent
  ],
  imports: [
    CommonModule,
    VerInformeRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class VerInformeModule { }
