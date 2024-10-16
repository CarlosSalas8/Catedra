import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguimientoRoutingModule } from './seguimiento-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SeguimientoComponent } from './seguimiento.component';


@NgModule({
  declarations: [
    SeguimientoComponent
  ],
  imports: [
    CommonModule,
    SeguimientoRoutingModule,
    SharedModule
  ]
})
export class SeguimientoModule { }
