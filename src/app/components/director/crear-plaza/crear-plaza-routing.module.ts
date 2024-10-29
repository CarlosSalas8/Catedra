import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPlazaComponent } from './crear-plaza.component';

const routes: Routes = [
  {path: '', component: CrearPlazaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearPlazaRoutingModule { }
