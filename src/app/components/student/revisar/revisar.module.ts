import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevisarRoutingModule } from './revisar-routing.module';
import { RevisarComponent } from './revisar.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideStudentModule } from '../../asides/aside-student/aside-student.module';
import { NavbarStudentModule } from '../../navbars/navbar-student/navbar-student.module';


@NgModule({
  declarations: [
    RevisarComponent
  ],
  imports: [
    CommonModule,
    RevisarRoutingModule,
    SharedModule,
    AsideStudentModule,
    NavbarStudentModule
  ]
})
export class RevisarModule { }
