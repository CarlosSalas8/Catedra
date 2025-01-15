import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAdminComponent } from './navbar-admin.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarAdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarAdminComponent
  ]
  })
export class NavbarAdminModule { }
