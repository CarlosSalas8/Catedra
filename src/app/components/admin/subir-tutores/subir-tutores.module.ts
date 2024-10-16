import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubirTutoresRoutingModule } from './subir-tutores-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SubirTutoresComponent } from './subir-tutores.component';


@NgModule({
  declarations: [
    SubirTutoresComponent
  ],
  imports: [
    CommonModule,
    SubirTutoresRoutingModule,
    SharedModule
  ]
})
export class SubirTutoresModule { }
