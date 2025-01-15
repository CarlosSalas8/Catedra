import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguimientoRoutingModule } from './seguimiento-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SeguimientoComponent } from './seguimiento.component';
import { AsideAdminModule } from '../../asides/aside-admin/aside-admin.module';
import { NavbarAdminModule } from '../../navbars/navbar-admin/navbar-admin.module';


@NgModule({
  declarations: [
    SeguimientoComponent
  ],
  imports: [
    CommonModule,
    SeguimientoRoutingModule,
    SharedModule,
    AsideAdminModule,
    NavbarAdminModule
  ]
})
export class SeguimientoModule { }
