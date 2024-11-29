import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevisarComponent } from './revisar.component';

const routes: Routes = [
  {path: '', component: RevisarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevisarRoutingModule { }
