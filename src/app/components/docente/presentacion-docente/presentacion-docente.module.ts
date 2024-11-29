import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentacionDocenteRoutingModule } from './presentacion-docente-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PresentacionDocenteComponent } from './presentacion-docente.component';


@NgModule({
  declarations: [
    PresentacionDocenteComponent
  ],
  imports: [
    CommonModule,
    PresentacionDocenteRoutingModule,
    SharedModule
  ]
})
export class PresentacionDocenteModule { }
