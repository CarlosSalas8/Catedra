import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeAyudanteRoutingModule } from './home-ayudante-routing.module';
import { HomeAyudanteComponent } from './home-ayudante.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    HomeAyudanteComponent
  ],
  imports: [
    CommonModule,
    HomeAyudanteRoutingModule,
    SharedModule
  ]
})
export class HomeAyudanteModule { }
