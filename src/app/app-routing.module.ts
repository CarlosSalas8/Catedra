import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard, ProfesorGuard, AlumnoGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'planificacion', pathMatch: 'full' },
  { path: 'planificacion', loadChildren: () => import('./components/teacher/planificacion/planificacion.module').then(x => x.PlanificacionModule), canActivate: [AuthGuard, ProfesorGuard] },
  { path: 'vista', loadChildren: () => import('./components/teacher/vista/vista.module').then(x => x.VistaModule), canActivate: [AuthGuard, ProfesorGuard] },
  { path: 'revisar/:id', loadChildren: () => import('./components/teacher/revisar/revisar.module').then(x => x.RevisarModule), canActivate: [AuthGuard, ProfesorGuard] },
  { path: '**', redirectTo: 'planificacion', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
