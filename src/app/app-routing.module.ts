import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadChildren: () => import('./components/home/home/home.module').then(x => x.HomeModule) },
  { path: 'login', loadChildren: () => import('./components/login/login.module').then(x => x.LoginModule) },
  { path: 'carrera', loadChildren: () => import('./components/home/carrera/carrera.module').then(x => x.CarreraModule)},

  { path: 'home-ayudante', loadChildren: () => import('./components/student/home-ayudante/home-ayudante.module').then(x => x.HomeAyudanteModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'planificacion', loadChildren: () => import('./components/student/planificacion/planificacion.module').then(x => x.PlanificacionModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'vista', loadChildren: () => import('./components/student/vista/vista.module').then(x => x.VistaModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'revisar/:id', loadChildren: () => import('./components/student/revisar/revisar.module').then(x => x.RevisarModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'presentacion', loadChildren: () => import('./components/student/presentacion/presentacion.module').then(x => x.PresentacionModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'plazas', loadChildren: () => import('./components/student/plazas/plazas.module').then(x => x.PlazasModule), canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },


  { path: 'home-docente', loadChildren: () => import('./components/docente/home-docente/home-docente.module').then(x => x.HomeDocenteModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin'] }, },
  { path: 'seguimiento-docente', loadChildren: () => import('./components/docente/seguimiento-docente/seguimiento-docente.module').then(x => x.SeguimientoDocenteModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin']  } },
  { path: 'presentacion-docente', loadChildren: () => import('./components/docente/presentacion-docente/presentacion-docente.module').then(x => x.PresentacionDocenteModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin']  } },
  { path: 'actividades-docentes/:id', loadChildren: () => import('./components/docente/actividades-docentes/actividades-docentes.module').then(m => m.ActividadesDocentesModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin']  } },
  { path: 'actividades-docentes/:id/validar/:actividadId', loadChildren: () => import('./components/docente/validar/validar.module').then(m => m.ValidarModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin']  } },

  { path: 'home-admin', loadChildren: () => import('./components/admin/home-admin/home-admin.module').then(x => x.HomeAdminModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }  },
  { path: 'seguimiento', loadChildren: () => import('./components/admin/seguimiento/seguimiento.module').then(x => x.SeguimientoModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }  },
  { path: 'subir-tutores', loadChildren: () => import('./components/admin/subir-tutores/subir-tutores.module').then(x => x.SubirTutoresModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }  },
  { path: 'teachers', loadChildren: () => import('./components/admin/teachers/teachers.module').then(x => x.TeachersModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }  },
  { path: 'submit', loadChildren: () => import('./components/admin/submit/submit.module').then(x => x.SubmitModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }  },

  { path: 'home-director', loadChildren: () => import('./components/director/home-director/home-director.module').then(x => x.HomeDirectorModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' }  },
  { path: 'crear-plaza', loadChildren: () => import('./components/director/crear-plaza/crear-plaza.module').then(x => x.CrearPlazaModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' }  },
  { path: 'postulantes/:id', loadChildren: () => import('./components/director/postulantes/postulantes.module').then(x => x.PostulantesModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' }  },



  { path: 'informe', loadChildren: () => import('./components/student/informe/informe.module').then(x => x.InformeModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'ver-informe', loadChildren: () => import('./components/student/ver-informe/ver-informe.module').then(x => x.VerInformeModule),canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' }  },

  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
