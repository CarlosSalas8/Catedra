import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentacionDocenteComponent } from './presentacion-docente.component';

const routes: Routes = [
  {path: '', component: PresentacionDocenteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentacionDocenteRoutingModule { }
