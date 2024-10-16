import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentanasComponent } from './ventanas.component';

const routes: Routes = [
  {path: '', component: VentanasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentanasRoutingModule { }
