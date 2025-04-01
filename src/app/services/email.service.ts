import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private functions: Functions
  ) { }

  sendEmail () {
    return httpsCallable(this.functions, 'sendEmailTeachers')({});
  }
}
