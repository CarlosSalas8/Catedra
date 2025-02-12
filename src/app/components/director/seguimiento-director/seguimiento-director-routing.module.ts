import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeguimientoDirectorComponent } from './seguimiento-director.component';

const routes: Routes = [
  {path: '', component: SeguimientoDirectorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguimientoDirectorRoutingModule { }
