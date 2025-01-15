import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideAdminComponent } from './aside-admin.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AsideAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ], 
  exports: [
    AsideAdminComponent
  ]
})
export class AsideAdminModule { }
