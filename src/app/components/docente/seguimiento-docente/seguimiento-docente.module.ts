import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguimientoDocenteRoutingModule } from './seguimiento-docente-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SeguimientoDocenteComponent } from './seguimiento-docente.component';
import { AsideTeachersModule } from '../../asides/aside-teachers/aside-teachers.module';
import { NavbarTeacherModule } from '../../navbars/navbar-teacher/navbar-teacher.module';


@NgModule({
  declarations: [
    SeguimientoDocenteComponent
  ],
  imports: [
    CommonModule,
    SeguimientoDocenteRoutingModule, 
    SharedModule,
    AsideTeachersModule,
    NavbarTeacherModule
  ]
})
export class SeguimientoDocenteModule { }
