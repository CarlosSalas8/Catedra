import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostulantesRoutingModule } from './postulantes-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PostulantesComponent } from './postulantes.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PostulantesComponent
  ],
  imports: [
    CommonModule,
    PostulantesRoutingModule,
    SharedModule,
    FormsModule 
  ]
})
export class PostulantesModule { }
