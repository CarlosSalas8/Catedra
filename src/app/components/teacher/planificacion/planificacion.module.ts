import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { PlanificacionComponent } from './planificacion.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    PlanificacionComponent
  ],
  imports: [
    CommonModule,
    PlanificacionRoutingModule,
    SharedModule
  ]
})
export class PlanificacionModule { }
