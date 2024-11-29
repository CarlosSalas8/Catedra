import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeDocenteComponent } from './home-docente.component';

const routes: Routes = [
  {path: '', component: HomeDocenteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeDocenteRoutingModule { }
