import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard, ProfesorGuard, AlumnoGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadChildren: () => import('./components/home/home.module').then(x => x.HomeModule)},
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(x => x.LoginModule)},
  { path: 'ventanas', loadChildren: () => import('./components/home/ventanas/ventanas.module').then(x => x.VentanasModule)},

  { path: 'home-ayudante', loadChildren: () => import('./components/teacher/home-ayudante/home-ayudante.module').then(x => x.HomeAyudanteModule)},
  { path: 'planificacion', loadChildren: () => import('./components/teacher/planificacion/planificacion.module').then(x => x.PlanificacionModule), canActivate: [AuthGuard, ProfesorGuard] },
  { path: 'vista', loadChildren: () => import('./components/teacher/vista/vista.module').then(x => x.VistaModule), canActivate: [AuthGuard, ProfesorGuard] },
  { path: 'revisar/:id', loadChildren: () => import('./components/teacher/revisar/revisar.module').then(x => x.RevisarModule), canActivate: [AuthGuard, ProfesorGuard] },
  { path: 'presentacion', loadChildren: () => import('./components/teacher/presentacion/presentacion.module').then(x => x.PresentacionModule), canActivate: [AuthGuard, ProfesorGuard] },
  


  { path: 'home-admin', loadChildren: () => import('./components/admin/home-admin/home-admin.module').then(x => x.HomeAdminModule)},
  { path: 'seguimiento', loadChildren: () => import('./components/admin/seguimiento/seguimiento.module').then(x => x.SeguimientoModule)},
  { path: 'subir-tutores', loadChildren: () => import('./components/admin/subir-tutores/subir-tutores.module').then(x => x.SubirTutoresModule)},

  { path: 'home-director', loadChildren: () => import('./components/director/home-director/home-director.module').then(x => x.HomeDirectorModule)},
  { path: 'crear-plaza', loadChildren: () => import('./components/director/crear-plaza/crear-plaza.module').then(x => x.CrearPlazaModule)},

  { path: 'actividades-docentes/:id', loadChildren: () => import('./components/admin/actividades-docentes/actividades-docentes.module').then(m => m.ActividadesDocentesModule) },
  { path: 'actividades-docentes/:id/validar/:actividadId', loadChildren: () => import('./components/admin/validar/validar.module').then(m => m.ValidarModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
