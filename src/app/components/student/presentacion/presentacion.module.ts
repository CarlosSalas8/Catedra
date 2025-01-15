import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentacionRoutingModule } from './presentacion-routing.module';
import { PresentacionComponent } from './presentacion.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    PresentacionComponent
  ],
  imports: [
    CommonModule,
    PresentacionRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class PresentacionModule { }
