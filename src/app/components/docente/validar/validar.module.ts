import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidarRoutingModule } from './validar-routing.module';
import { ValidarComponent } from './validar.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideTeachersModule } from '../../asides/aside-teachers/aside-teachers.module';
import { NavbarTeacherModule } from '../../navbars/navbar-teacher/navbar-teacher.module';


@NgModule({
  declarations: [
    ValidarComponent
  ],
  imports: [
    CommonModule,
    ValidarRoutingModule,
    SharedModule,
    AsideTeachersModule,
    NavbarTeacherModule
  ]
})
export class ValidarModule { }
