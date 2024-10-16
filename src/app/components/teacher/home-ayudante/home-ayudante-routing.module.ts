import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAyudanteComponent } from './home-ayudante.component';

const routes: Routes = [
  {path: '', component: HomeAyudanteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeAyudanteRoutingModule { }
