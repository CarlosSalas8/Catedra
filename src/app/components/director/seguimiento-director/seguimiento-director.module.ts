import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguimientoDirectorRoutingModule } from './seguimiento-director-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AsideDirectorsModule } from '../../asides/aside-directors/aside-directors.module';
import { NavbarDirectorsModule } from '../../navbars/navbar-directors/navbar-directors.module';
import { SeguimientoDirectorComponent } from './seguimiento-director.component';


@NgModule({
  declarations: [
    SeguimientoDirectorComponent
  ],
  imports: [
    CommonModule,
    SeguimientoDirectorRoutingModule,
    SharedModule,
    AsideDirectorsModule,
    NavbarDirectorsModule
  ]
})
export class SeguimientoDirectorModule { }
