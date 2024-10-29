import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeDirectorRoutingModule } from './home-director-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
import { HomeDirectorComponent } from './home-director.component';


@NgModule({
  declarations: [
    HomeDirectorComponent
  ],
  imports: [
    CommonModule,
    HomeDirectorRoutingModule,
    SharedModule
  ]
})
export class HomeDirectorModule { }
