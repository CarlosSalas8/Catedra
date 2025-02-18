import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsideStudentComponent } from '../asides/aside-student/aside-student.component';
import { NavbarStudentComponent } from '../navbars/navbar-student/navbar-student.component';
import { AsideTeachersComponent } from '../asides/aside-teachers/aside-teachers.component';
import { NavbarTeacherComponent } from '../navbars/navbar-teacher/navbar-teacher.component';
import { AsideDirectorsComponent } from '../asides/aside-directors/aside-directors.component';
import { NavbarDirectorsComponent } from '../navbars/navbar-directors/navbar-directors.component';
import { AsideAdminComponent } from '../asides/aside-admin/aside-admin.component';
import { NavbarAdminComponent } from '../navbars/navbar-admin/navbar-admin.component';




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
