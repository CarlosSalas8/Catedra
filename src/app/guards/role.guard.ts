import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const expectedRoles = route.data['expectedRole'];
        const user = await this.authService.getCurrentUser5();

        if (user) {
            if (Array.isArray(expectedRoles) && expectedRoles.includes(user.role)) {
                return true;
            } else if (user.role === expectedRoles) {
                return true;
            }
        }

        this.router.navigate(['/home']);
        return false;
    }

}
