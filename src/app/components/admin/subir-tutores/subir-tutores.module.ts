import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubirTutoresRoutingModule } from './subir-tutores-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { SubirTutoresComponent } from './subir-tutores.component';
import { AsideAdminModule } from '../../asides/aside-admin/aside-admin.module';
import { NavbarAdminModule } from '../../navbars/navbar-admin/navbar-admin.module';


@NgModule({
  declarations: [
    SubirTutoresComponent
  ],
  imports: [
    CommonModule,
    SubirTutoresRoutingModule,
    SharedModule,
    AsideAdminModule,
    NavbarAdminModule
  ]
})
export class SubirTutoresModule { }
