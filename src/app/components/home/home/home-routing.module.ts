import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CarreraComponent } from '../carrera/carrera.component';
import { LoginComponent } from '../../login/login.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { RoleGuard } from 'src/app/services/role.guard';
import { HomeAyudanteComponent } from '../../student/home-ayudante/home-ayudante.component';
import { HomeDocenteComponent } from '../../docente/home-docente/home-docente.component';
import { HomeDirectorComponent } from '../../director/home-director/home-director.component';
import { HomeAdminComponent } from '../../admin/home-admin/home-admin.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'carrera', component: CarreraComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home-ayudante', component: HomeAyudanteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'student' } },
  { path: 'home-docente/:email', component: HomeDocenteComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: ['teacher', 'admin', 'director'] }, },
  { path: 'home-director', component: HomeDirectorComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'director' } },
  { path: 'home-admin', component: HomeAdminComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
