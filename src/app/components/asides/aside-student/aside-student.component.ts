import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aside-student',
  templateUrl: './aside-student.component.html',
  styleUrls: ['./aside-student.component.css']
})
export class AsideStudentComponent implements OnInit {
  validated: boolean | null = null;

  constructor(private authService: AuthService, private firestore: AngularFirestore) {}

  async ngOnInit(): Promise<void> {
    // Obtén el usuario actual
    this.authService.getCurrentUser().subscribe(async (currentUser) => {
      if (currentUser) {
        const userDoc = await this.firestore.collection('users').doc(currentUser.uid).get().toPromise();
        if (userDoc?.exists) {
          const userData = userDoc.data() as { validated?: boolean };
          this.validated = userData?.validated || false;
          console.log('Valor de validated:', this.validated);
        } else {
          console.error('No se encontró el documento del usuario.');
        }
      } else {
        console.error('No hay un usuario autenticado.');
      }
    });
  }
}