import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeachersRoutingModule } from './teachers-routing.module';
import { TeachersComponent } from './teachers.component';
import { SharedModule } from '../../shared/shared.module';
import { AsideAdminModule } from '../../asides/aside-admin/aside-admin.module';
import { NavbarAdminModule } from '../../navbars/navbar-admin/navbar-admin.module';


@NgModule({
  declarations: [
    TeachersComponent
  ],
  imports: [
    CommonModule,
    TeachersRoutingModule,
    SharedModule,
    AsideAdminModule,
    NavbarAdminModule
  ]
})
export class TeachersModule { }
