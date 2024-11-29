import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentacionRoutingModule } from './presentacion-routing.module';
import { PresentacionComponent } from './presentacion.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    PresentacionComponent
  ],
  imports: [
    CommonModule,
    PresentacionRoutingModule,
    SharedModule
  ]
})
export class PresentacionModule { }
