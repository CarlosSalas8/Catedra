import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { RoleGuard } from './services/role.guard';
import { HomeDocenteComponent } from './components/docente/home-docente/home-docente.component';
import { SeguimientoDocenteComponent } from './components/docente/seguimiento-docente/seguimiento-docente.component';
import { ActividadesDocentesComponent } from './components/docente/actividades-docentes/actividades-docentes.component';
import { ValidarComponent } from './components/docente/validar/validar.component';
import { HomeComponent } from './components/home/home/home.component';
import { InformeDocenteComponent } from './components/docente/informe-docente/informe-docente.component';
import { InformeDirectorComponent } from './components/director/informe-director/informe-director.component';
import { LoginComponent } from './components/login/login.component';
import { CarreraComponent } from './components/home/carrera/carrera.component';
import { InformeComponent } from './components/student/informe/informe.component';
import { HomeAyudanteComponent } from './components/student/home-ayudante/home-ayudante.component';
import { PlanificacionComponent } from './components/student/planificacion/planificacion.component';
import { VistaComponent } from './components/student/vista/vista.component';
import { PlazasComponent } from './components/student/plazas/plazas.component';
import { PresentacionComponent } from './components/student/presentacion/presentacion.component';
import { RevisarComponent } from './components/student/revisar/revisar.component';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { InformeAdminComponent } from './components/admin/informe-admin/informe-admin.component';
import { SeguimientoComponent } from './components/admin/seguimiento/seguimiento.component';
import { SubirTutoresComponent } from './components/admin/subir-tutores/subir-tutores.component';
import { SubmitComponent } from './components/admin/submit/submit.component';
import { CrearPlazaComponent } from './components/director/crear-plaza/crear-plaza.component';
import { SeguimientoDirectorComponent } from './components/director/seguimiento-director/seguimiento-director.component';
import { HomeDirectorComponent } from './components/director/home-director/home-director.component';
import { PostulantesComponent } from './components/director/postulantes/postulantes.component';


const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'carrera', component: CarreraComponent },

  { path: 'home-ayudante', component: HomeAyudanteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'planificacion', component: PlanificacionComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'vista', component: VistaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'revisar/:id', component: RevisarComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'presentacion', component: PresentacionComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'plazas', component: PlazasComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },


  { path: 'home-docente/:email', component: HomeDocenteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin', 'director'] }, },
  { path: 'seguimiento-docente/:email', component: SeguimientoDocenteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin', 'director'] } },
  { path: 'actividades-docentes/:id/:assistant/:email', component: ActividadesDocentesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin', 'director'] } },
  { path: 'actividades-docentes/:id/:assistant/:email/validar/:actividadId', component: ValidarComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin', 'director'] } },



  { path: 'informe-docente', component: InformeDocenteComponent },



  { path: 'home-admin', component: HomeAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'seguimiento', component: SeguimientoComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'subir-tutores', component: SubirTutoresComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'submit', component: SubmitComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'informe-admin', component: InformeAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },



  { path: 'home-director', component: HomeDirectorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'crear-plaza', component: CrearPlazaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'postulantes/:id', component: PostulantesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'seguimiento-director', component: SeguimientoDirectorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'informe-director', component: InformeDirectorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },


  { path: 'informe', component: InformeComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },


  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
