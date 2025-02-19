import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home/home.component';
import { CarreraComponent } from '../components/home/carrera/carrera.component';

import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { HomeAyudanteComponent } from '../components/student/home-ayudante/home-ayudante.component';
import { HomeDocenteComponent } from '../components/docente/home-docente/home-docente.component';
import { HomeDirectorComponent } from '../components/director/home-director/home-director.component';
import { HomeAdminComponent } from '../components/admin/home-admin/home-admin.component';
import { LoginComponent } from '../components/home/login/login.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'carrera', component: CarreraComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home-ayudante', component: HomeAyudanteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'home-docente', component: HomeDocenteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher'] }, },
  { path: 'home-director', component: HomeDirectorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'home-admin', component: HomeAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
