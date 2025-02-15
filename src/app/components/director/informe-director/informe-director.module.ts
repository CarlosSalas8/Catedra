import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformeDirectorRoutingModule } from './informe-director-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { AsideDirectorsModule } from '../../asides/aside-directors/aside-directors.module';
import { NavbarDirectorsModule } from '../../navbars/navbar-directors/navbar-directors.module';
import { InformeDirectorComponent } from './informe-director.component';


@NgModule({
  declarations: [
    InformeDirectorComponent
  ],
  imports: [
    CommonModule,
    InformeDirectorRoutingModule,
    SharedModule,
    AsideDirectorsModule,
    NavbarDirectorsModule
  ]
})
export class InformeDirectorModule { }
