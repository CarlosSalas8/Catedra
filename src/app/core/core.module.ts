import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PlanificacionComponent } from '../components/student/planificacion/planificacion.component';
import { VistaComponent } from '../components/student/vista/vista.component';
import { RevisarComponent } from '../components/student/revisar/revisar.component';
import { PresentacionComponent } from '../components/student/presentacion/presentacion.component';
import { PlazasComponent } from '../components/student/plazas/plazas.component';
import { InformeComponent } from '../components/student/informe/informe.component';
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
import { ListadoEstudiantesComponent } from '../components/docente/listado-estudiantes/listado-estudiantes.component';


@NgModule({
  declarations: [
    PlanificacionComponent,
    VistaComponent,
    RevisarComponent,
    PresentacionComponent,
    PlazasComponent,
    InformeComponent,
    SeguimientoDocenteComponent,
    ActividadesDocentesComponent,
    ValidarComponent,
    InformeDocenteComponent,
    SeguimientoComponent,
    SubirTutoresComponent,
    SubmitComponent,
    InformeAdminComponent,
    CrearPlazaComponent,
    PostulantesComponent,
    SeguimientoDirectorComponent,
    InformeDirectorComponent,
    ListadoEstudiantesComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule
  ]
})
export class CoreModule { }