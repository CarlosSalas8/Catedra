import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private functions: Functions
  ) { }

  sendEmail (career: string, id: string) {
    return httpsCallable(this.functions, 'sendEmailTeachers')({career: career, careerId: id});
  }
}
