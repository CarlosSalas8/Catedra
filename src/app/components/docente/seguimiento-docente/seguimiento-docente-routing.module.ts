import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeguimientoDocenteComponent } from './seguimiento-docente.component';

const routes: Routes = [
  {path: '', component: SeguimientoDocenteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguimientoDocenteRoutingModule { }
