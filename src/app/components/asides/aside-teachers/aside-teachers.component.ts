import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aside-teachers',
  templateUrl: './aside-teachers.component.html',
  styleUrls: ['./aside-teachers.component.css']
})
export class AsideTeachersComponent implements OnInit {
  teacherEmail: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.teacherEmail = user.email;      
      } else {
        this.teacherEmail = 'default@example.com'; 
      }
    });
  }
  
}
