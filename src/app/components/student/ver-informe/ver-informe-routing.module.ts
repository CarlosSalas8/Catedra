import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerInformeComponent } from './ver-informe.component';

const routes: Routes = [
  {path: '', component: VerInformeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerInformeRoutingModule { }
