import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeDocenteRoutingModule } from './home-docente-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeDocenteComponent } from './home-docente.component';
import { AsideTeachersModule } from '../../asides/aside-teachers/aside-teachers.module';
import { NavbarTeacherModule } from '../../navbars/navbar-teacher/navbar-teacher.module';


@NgModule({
  declarations: [
    HomeDocenteComponent
  ],
  imports: [
    CommonModule,
    HomeDocenteRoutingModule,
    SharedModule,
    AsideTeachersModule,
    NavbarTeacherModule
  ]
})
export class HomeDocenteModule { }
