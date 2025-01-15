import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideDirectorsComponent } from './aside-directors.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AsideDirectorsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    AsideDirectorsComponent
  ]
})
export class AsideDirectorsModule { }
