import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VistaRoutingModule } from './vista-routing.module';
import { VistaComponent } from './vista.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    VistaComponent
  ],
  imports: [
    CommonModule,
    VistaRoutingModule,
    SharedModule
  ]
})
export class VistaModule { }
