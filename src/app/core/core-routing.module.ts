import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanificacionComponent } from '../components/student/planificacion/planificacion.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { VistaComponent } from '../components/student/vista/vista.component';
import { RevisarComponent } from '../components/student/revisar/revisar.component';
import { PresentacionComponent } from '../components/student/presentacion/presentacion.component';
import { PlazasComponent } from '../components/student/plazas/plazas.component';
import { SeguimientoDocenteComponent } from '../components/docente/seguimiento-docente/seguimiento-docente.component';
import { ActividadesDocentesComponent } from '../components/docente/actividades-docentes/actividades-docentes.component';
import { ValidarComponent } from '../components/docente/validar/validar.component';
import { InformeDocenteComponent } from '../components/docente/informe-docente/informe-docente.component';
import { SeguimientoComponent } from '../components/admin/seguimiento/seguimiento.component';
import { SubirTutoresComponent } from '../components/admin/subir-tutores/subir-tutores.component';
import { SubmitComponent } from '../components/admin/submit/submit.component';
import { InformeAdminComponent } from '../components/admin/informe-admin/informe-admin.component';
import { CrearPlazaComponent } from '../components/director/crear-plaza/crear-plaza.component';
import { PostulantesComponent } from '../components/director/postulantes/postulantes.component';
import { SeguimientoDirectorComponent } from '../components/director/seguimiento-director/seguimiento-director.component';
import { InformeDirectorComponent } from '../components/director/informe-director/informe-director.component';
import { InformeComponent } from '../components/student/informe/informe.component';

const routes: Routes = [

  { path: 'planificacion', component: PlanificacionComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'vista', component: VistaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'revisar/:id', component: RevisarComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'presentacion', component: PresentacionComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'plazas', component: PlazasComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'informe', component: InformeComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },



  { path: 'seguimiento-docente', component: SeguimientoDocenteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'teacher' } },
  { path: 'actividades-docentes/:id/:assistant', component: ActividadesDocentesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'teacher' } },
  { path: 'actividades-docentes/:id/:assistant/validar/:actividadId', component: ValidarComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'teacher' } },
  { path: 'informe-docente', component: InformeDocenteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'teacher' } },



  { path: 'crear-plaza', component: CrearPlazaComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'postulantes/:id', component: PostulantesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'seguimiento-director', component: SeguimientoDirectorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'informe-director', component: InformeDirectorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },



  { path: 'seguimiento', component: SeguimientoComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'subir-tutores', component: SubirTutoresComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'submit', component: SubmitComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  { path: 'informe-admin', component: InformeAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
