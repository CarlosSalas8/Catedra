import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearPlazaRoutingModule } from './crear-plaza-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CrearPlazaComponent } from './crear-plaza.component';
import { FormsModule } from '@angular/forms';
import { AsideDirectorsModule } from '../../asides/aside-directors/aside-directors.module';
import { NavbarDirectorsModule } from '../../navbars/navbar-directors/navbar-directors.module';


@NgModule({
  declarations: [
    CrearPlazaComponent
  ],
  imports: [
    CommonModule,
    CrearPlazaRoutingModule,
    SharedModule,
    FormsModule,
    AsideDirectorsModule,
    NavbarDirectorsModule 
  ]
})
export class CrearPlazaModule { }
