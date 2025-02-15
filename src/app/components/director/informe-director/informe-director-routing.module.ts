import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformeDirectorComponent } from './informe-director.component';

const routes: Routes = [
  {path: '', component: InformeDirectorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformeDirectorRoutingModule { }
