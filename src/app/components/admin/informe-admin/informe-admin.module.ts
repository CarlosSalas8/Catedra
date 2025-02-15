import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InformeAdminRoutingModule } from './informe-admin-routing.module';
import { InformeAdminComponent } from './informe-admin.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideAdminModule } from '../../asides/aside-admin/aside-admin.module';
import { NavbarAdminModule } from '../../navbars/navbar-admin/navbar-admin.module';


@NgModule({
  declarations: [
    InformeAdminComponent
  ],
  imports: [
    CommonModule,
    InformeAdminRoutingModule,
    SharedModule,
    AsideAdminModule,
    NavbarAdminModule
  ]
})
export class InformeAdminModule { }
