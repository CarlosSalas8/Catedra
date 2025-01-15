import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PeriodoService } from 'src/app/services/periodo.service';

@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.css']
})
export class SeguimientoComponent implements OnInit{
  
  
  directors$: Observable<any[]> | undefined;
  
  constructor(public periodoService: PeriodoService,private firestore: AngularFirestore) {}

  ngOnInit(): void {
    
    this.directors$ = this.firestore.collection('directors').valueChanges();
  }
  
}
