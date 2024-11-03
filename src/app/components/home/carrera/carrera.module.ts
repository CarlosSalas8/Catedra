import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarreraRoutingModule } from './carrera-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CarreraComponent } from './carrera.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CarreraComponent
  ],
  imports: [
    CommonModule,
    CarreraRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class CarreraModule { }
