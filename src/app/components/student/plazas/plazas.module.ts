import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlazasRoutingModule } from './plazas-routing.module';
import { PlazasComponent } from './plazas.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    PlazasComponent
  ],
  imports: [
    CommonModule,
    PlazasRoutingModule,
    SharedModule
  ]
})
export class PlazasModule { }
