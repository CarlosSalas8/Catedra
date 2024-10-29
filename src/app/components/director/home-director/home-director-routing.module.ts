import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeDirectorComponent } from './home-director.component';

const routes: Routes = [
  {path: '', component: HomeDirectorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeDirectorRoutingModule { }
