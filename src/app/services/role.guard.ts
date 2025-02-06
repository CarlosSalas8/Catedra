import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const expectedRole = route.data['expectedRole'];

        try {
            const user = await this.authService.getCurrentUser5();


            if (user && user.role === expectedRole) {
                return true;
            } else {
                this.router.navigate(['/home']);
                return false;
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            this.router.navigate(['/home']);
            return false;
        }
    }
}
