import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarStudentComponent } from './navbar-student.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarStudentComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarStudentComponent
  ]
})
export class NavbarStudentModule { }
