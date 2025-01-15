import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeDirectorRoutingModule } from './home-director-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { HomeDirectorComponent } from './home-director.component';
import { AsideDirectorsModule } from '../../asides/aside-directors/aside-directors.module';
import { NavbarDirectorsModule } from '../../navbars/navbar-directors/navbar-directors.module';


@NgModule({
  declarations: [
    HomeDirectorComponent
  ],
  imports: [
    CommonModule,
    HomeDirectorRoutingModule,
    SharedModule,
    AsideDirectorsModule,
    NavbarDirectorsModule
  ]
})
export class HomeDirectorModule { }
