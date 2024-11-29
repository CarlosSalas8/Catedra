import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguimientoDocenteRoutingModule } from './seguimiento-docente-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SeguimientoDocenteComponent } from './seguimiento-docente.component';


@NgModule({
  declarations: [
    SeguimientoDocenteComponent
  ],
  imports: [
    CommonModule,
    SeguimientoDocenteRoutingModule, 
    SharedModule
  ]
})
export class SeguimientoDocenteModule { }
