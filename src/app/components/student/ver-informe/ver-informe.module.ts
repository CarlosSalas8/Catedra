import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerInformeRoutingModule } from './ver-informe-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { VerInformeComponent } from './ver-informe.component';


@NgModule({
  declarations: [
    VerInformeComponent
  ],
  imports: [
    CommonModule,
    VerInformeRoutingModule,
    SharedModule
  ]
})
export class VerInformeModule { }
