import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AdminGuard, ProfesorGuard, AlumnoGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadChildren: () => import('./components/home/home/home.module').then(x => x.HomeModule)},
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(x => x.LoginModule)},
  { path: 'ventanas', loadChildren: () => import('./components/home/ventanas/ventanas.module').then(x => x.VentanasModule)},
  { path: 'carrera', loadChildren: () => import('./components/home/carrera/carrera.module').then(x => x.CarreraModule)},

  { path: 'home-ayudante', loadChildren: () => import('./components/student/home-ayudante/home-ayudante.module').then(x => x.HomeAyudanteModule)},
  { path: 'planificacion', loadChildren: () => import('./components/student/planificacion/planificacion.module').then(x => x.PlanificacionModule)},
  { path: 'vista', loadChildren: () => import('./components/student/vista/vista.module').then(x => x.VistaModule)},
  { path: 'revisar/:id', loadChildren: () => import('./components/student/revisar/revisar.module').then(x => x.RevisarModule)},
  { path: 'presentacion', loadChildren: () => import('./components/student/presentacion/presentacion.module').then(x => x.PresentacionModule)},
  { path: 'plazas', loadChildren: () => import('./components/student/plazas/plazas.module').then(x => x.PlazasModule) },


  { path: 'home-docente', loadChildren: () => import('./components/docente/home-docente/home-docente.module').then(x => x.HomeDocenteModule) },
  { path: 'seguimiento-docente', loadChildren: () => import('./components/docente/seguimiento-docente/seguimiento-docente.module').then(x => x.SeguimientoDocenteModule) },
  { path: 'presentacion-docente', loadChildren: () => import('./components/docente/presentacion-docente/presentacion-docente.module').then(x => x.PresentacionDocenteModule) },
  { path: 'actividades-docentes/:id', loadChildren: () => import('./components/docente/actividades-docentes/actividades-docentes.module').then(m => m.ActividadesDocentesModule) },
  { path: 'actividades-docentes/:id/validar/:actividadId', loadChildren: () => import('./components/docente/validar/validar.module').then(m => m.ValidarModule) },

  { path: 'home-admin', loadChildren: () => import('./components/admin/home-admin/home-admin.module').then(x => x.HomeAdminModule)},
  { path: 'seguimiento', loadChildren: () => import('./components/admin/seguimiento/seguimiento.module').then(x => x.SeguimientoModule)},
  { path: 'subir-tutores', loadChildren: () => import('./components/admin/subir-tutores/subir-tutores.module').then(x => x.SubirTutoresModule)},

  { path: 'home-director', loadChildren: () => import('./components/director/home-director/home-director.module').then(x => x.HomeDirectorModule)},
  { path: 'crear-plaza', loadChildren: () => import('./components/director/crear-plaza/crear-plaza.module').then(x => x.CrearPlazaModule)},
  { path: 'postulantes/:id', loadChildren: () => import('./components/director/postulantes/postulantes.module').then(x => x.PostulantesModule)},

  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
