import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubirTutoresComponent } from './subir-tutores.component';

const routes: Routes = [
  {path: '', component: SubirTutoresComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubirTutoresRoutingModule { }
