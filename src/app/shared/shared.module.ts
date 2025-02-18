import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsideStudentComponent } from '../components/asides/aside-student/aside-student.component';
import { NavbarStudentComponent } from '../components/navbars/navbar-student/navbar-student.component';
import { AsideTeachersComponent } from '../components/asides/aside-teachers/aside-teachers.component';
import { NavbarTeacherComponent } from '../components/navbars/navbar-teacher/navbar-teacher.component';
import { AsideDirectorsComponent } from '../components/asides/aside-directors/aside-directors.component';
import { NavbarDirectorsComponent } from '../components/navbars/navbar-directors/navbar-directors.component';
import { AsideAdminComponent } from '../components/asides/aside-admin/aside-admin.component';
import { NavbarAdminComponent } from '../components/navbars/navbar-admin/navbar-admin.component';




@NgModule({
  declarations: [
    AsideStudentComponent,
    NavbarStudentComponent,
    AsideTeachersComponent,
    NavbarTeacherComponent,
    AsideDirectorsComponent,
    NavbarDirectorsComponent,
    AsideAdminComponent,
    NavbarAdminComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    AsideStudentComponent,
    NavbarStudentComponent,
    AsideTeachersComponent,
    NavbarTeacherComponent,
    AsideDirectorsComponent,
    NavbarDirectorsComponent,
    AsideAdminComponent,
    NavbarAdminComponent
  ]
})
export class SharedModule { }
