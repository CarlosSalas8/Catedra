import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const expectedRoles = route.data['expectedRole']; // Puede ser string o array

        try {
            const user = await this.authService.getCurrentUser5();

            if (user) {
                if (Array.isArray(expectedRoles)) {
                    // Verificar si el rol del usuario está en el array de roles permitidos
                    if (expectedRoles.includes(user.role)) {
                        return true;
                    }
                } else {
                    // Manejar caso de un solo rol como string
                    if (user.role === expectedRoles) {
                        return true;
                    }
                }
            }

            // Redirigir si no tiene permisos
            this.router.navigate(['/home']);
            return false;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            this.router.navigate(['/home']);
            return false;
        }
    }
}
