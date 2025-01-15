import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostulantesRoutingModule } from './postulantes-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PostulantesComponent } from './postulantes.component';
import { FormsModule } from '@angular/forms';
import { AsideDirectorsModule } from '../../asides/aside-directors/aside-directors.module';
import { NavbarDirectorsModule } from '../../navbars/navbar-directors/navbar-directors.module';


@NgModule({
  declarations: [
    PostulantesComponent
  ],
  imports: [
    CommonModule,
    PostulantesRoutingModule,
    SharedModule,
    FormsModule,
    AsideDirectorsModule,
    NavbarDirectorsModule 
  ]
})
export class PostulantesModule { }
