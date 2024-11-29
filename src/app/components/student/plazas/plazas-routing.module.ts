import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlazasComponent } from './plazas.component';

const routes: Routes = [
  {path: '', component: PlazasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlazasRoutingModule { }
