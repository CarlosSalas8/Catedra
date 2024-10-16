import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActividadesDocentesComponent } from './actividades-docentes.component';
import { ValidarComponent } from '../validar/validar.component';

const routes: Routes = [
  {path: '', component: ActividadesDocentesComponent},
  { path: 'validar/:actividadId', component: ValidarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesDocentesRoutingModule { }
