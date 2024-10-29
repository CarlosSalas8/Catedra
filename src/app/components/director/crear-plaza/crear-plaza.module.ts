import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrearPlazaRoutingModule } from './crear-plaza-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CrearPlazaComponent } from './crear-plaza.component';


@NgModule({
  declarations: [
    CrearPlazaComponent
  ],
  imports: [
    CommonModule,
    CrearPlazaRoutingModule,
    SharedModule
  ]
})
export class CrearPlazaModule { }
