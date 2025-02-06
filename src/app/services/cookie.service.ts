import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CustomCookieService {

  constructor(private cookieService: CookieService) { }

  setCookie(name: string, value: string, days: number): void {
    this.cookieService.set(name, value, days, '/'); // '/' para que esté disponible en toda la app
  }

  getCookie(name: string): string {
    return this.cookieService.get(name);
  }

  deleteCookie(name: string): void {
    this.cookieService.delete(name, '/');
  }
}
