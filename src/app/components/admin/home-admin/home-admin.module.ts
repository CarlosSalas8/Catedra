import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeAdminRoutingModule } from './home-admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeAdminComponent } from './home-admin.component';


@NgModule({
  declarations: [
    HomeAdminComponent
  ],
  imports: [
    CommonModule,
    HomeAdminRoutingModule,
    SharedModule
  ]
})
export class HomeAdminModule { }
