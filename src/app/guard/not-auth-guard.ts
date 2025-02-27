import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/auth/login.service';

export const notAuthGuard: CanActivateFn = (route, state) => {
    const sessionSrv = inject(LoginService);
    const router = inject(Router);
    return !sessionSrv.userIsLogged ? true : router.navigate(['/dashboard']);
};