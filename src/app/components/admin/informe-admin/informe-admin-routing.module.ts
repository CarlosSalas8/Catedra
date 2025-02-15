import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformeAdminComponent } from './informe-admin.component';

const routes: Routes = [
  {path: '', component: InformeAdminComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformeAdminRoutingModule { }
