import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentanasRoutingModule } from './ventanas-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from '../home.component';
import { VentanasComponent } from './ventanas.component';


@NgModule({
  declarations: [
    VentanasComponent
  ],
  imports: [
    CommonModule,
    VentanasRoutingModule,
    SharedModule
  ]
})
export class VentanasModule { }
