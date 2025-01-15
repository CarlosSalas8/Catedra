import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarTeacherComponent } from './navbar-teacher.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarTeacherComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarTeacherComponent
  ]
})
export class NavbarTeacherModule { }
