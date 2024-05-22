import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'planificacion',pathMatch: 'full' },
  {path: 'planificacion', loadChildren: () => import('./components/planificacion/planificacion.module').then(x => x.PlanificacionModule)},
  {path: 'vista', loadChildren: () => import('./components/vista/vista.module').then(x => x.VistaModule)},
  {path: '**', redirectTo: 'planificacion',pathMatch: 'full'  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
