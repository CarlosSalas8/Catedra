import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActividadesDocentesRoutingModule } from './actividades-docentes-routing.module';
import { ActividadesDocentesComponent } from './actividades-docentes.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideTeachersModule } from '../../asides/aside-teachers/aside-teachers.module';
import { NavbarTeacherModule } from '../../navbars/navbar-teacher/navbar-teacher.module';


@NgModule({
  declarations: [
    ActividadesDocentesComponent
  ],
  imports: [
    CommonModule,
    ActividadesDocentesRoutingModule,
    SharedModule,
    AsideTeachersModule,
    NavbarTeacherModule
  ]
})
export class ActividadesDocentesModule { }
