import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent {

  carreraSeleccionada: string = '';

  constructor(private router: Router) {}

  validarCarrera() {
    if (this.carreraSeleccionada) {
      // Redirigir a la página de plazas con la carrera como parámetro
      this.router.navigate(['/ventanas']);
    } else {
      alert('Por favor, selecciona una carrera.');
    }
  }

}
