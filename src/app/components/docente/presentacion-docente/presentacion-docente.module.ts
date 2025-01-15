import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentacionDocenteRoutingModule } from './presentacion-docente-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PresentacionDocenteComponent } from './presentacion-docente.component';
import { AsideTeachersModule } from '../../asides/aside-teachers/aside-teachers.module';
import { NavbarTeacherModule } from '../../navbars/navbar-teacher/navbar-teacher.module';


@NgModule({
  declarations: [
    PresentacionDocenteComponent
  ],
  imports: [
    CommonModule,
    PresentacionDocenteRoutingModule,
    SharedModule,
    AsideTeachersModule,
    NavbarTeacherModule
  ]
})
export class PresentacionDocenteModule { }
