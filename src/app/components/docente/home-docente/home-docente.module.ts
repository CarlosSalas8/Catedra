import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeDocenteRoutingModule } from './home-docente-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeDocenteComponent } from './home-docente.component';


@NgModule({
  declarations: [
    HomeDocenteComponent
  ],
  imports: [
    CommonModule,
    HomeDocenteRoutingModule,
    SharedModule
  ]
})
export class HomeDocenteModule { }
