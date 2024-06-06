import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevisarRoutingModule } from './revisar-routing.module';
import { RevisarComponent } from './revisar.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    RevisarComponent
  ],
  imports: [
    CommonModule,
    RevisarRoutingModule,
    SharedModule
  ]
})
export class RevisarModule { }
