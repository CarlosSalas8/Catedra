import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideTeachersComponent } from './aside-teachers.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AsideTeachersComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    AsideTeachersComponent
  ]
})
export class AsideTeachersModule { }
