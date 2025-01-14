import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformeComponent } from './informe.component';

const routes: Routes = [
  {path: '', component: InformeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformeRoutingModule { }
