import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeAdminRoutingModule } from './home-admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { HomeAdminComponent } from './home-admin.component';
import { AsideAdminModule } from '../../asides/aside-admin/aside-admin.module';
import { NavbarAdminModule } from '../../navbars/navbar-admin/navbar-admin.module';


@NgModule({
  declarations: [
    HomeAdminComponent
  ],
  imports: [
    CommonModule,
    HomeAdminRoutingModule,
    SharedModule,
    AsideAdminModule,
    NavbarAdminModule
  ]
})
export class HomeAdminModule { }
