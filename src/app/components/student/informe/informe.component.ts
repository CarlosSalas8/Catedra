import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.component.html',
  styleUrls: ['./informe.component.css']
})
export class InformeComponent implements OnInit {


  userEmail: string | null = null;

  constructor(private authService: AuthService) {


  }

  ngOnInit(): void {
    // Obtener el usuario logueado
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userEmail = user.email;

        if (user.email) {

        }
      } else {
        console.error('No hay un usuario autenticado.');
      }
    });

  }

}