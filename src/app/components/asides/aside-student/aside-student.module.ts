import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideStudentComponent } from './aside-student.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AsideStudentComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    AsideStudentComponent
  ]
})
export class AsideStudentModule { }
