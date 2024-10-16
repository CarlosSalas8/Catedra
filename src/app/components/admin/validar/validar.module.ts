import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidarRoutingModule } from './validar-routing.module';
import { ValidarComponent } from './validar.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ValidarComponent
  ],
  imports: [
    CommonModule,
    ValidarRoutingModule,
    SharedModule
  ]
})
export class ValidarModule { }
