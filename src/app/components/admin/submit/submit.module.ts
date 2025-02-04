import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmitRoutingModule } from './submit-routing.module';
import { AsideAdminModule } from '../../asides/aside-admin/aside-admin.module';
import { NavbarAdminModule } from '../../navbars/navbar-admin/navbar-admin.module';
import { SharedModule } from '../../shared/shared.module';
import { SubmitComponent } from './submit.component';



@NgModule({
  declarations: [
    SubmitComponent
  ],
  imports: [
    CommonModule,
    SubmitRoutingModule,
    SharedModule,
    AsideAdminModule,
    NavbarAdminModule

  ]
})
export class SubmitModule { }
