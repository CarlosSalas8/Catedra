import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformeRoutingModule } from './informe-routing.module';
import { InformeComponent } from './informe.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    InformeComponent
  ],
  imports: [
    CommonModule,
    InformeRoutingModule,
    SharedModule
  ]
})
export class InformeModule { }
