import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarDirectorsComponent } from './navbar-directors.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarDirectorsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
      NavbarDirectorsComponent
    ]
})
export class NavbarDirectorsModule { }
