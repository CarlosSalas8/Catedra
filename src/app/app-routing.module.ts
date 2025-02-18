import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: '', loadChildren: () => import('./components/home/home/home.module').then(m => m.HomeModule) },

  { path: '', loadChildren: () => import('./core/core.module').then(m => m.CoreModule) },

  { path: '**', redirectTo: 'home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
