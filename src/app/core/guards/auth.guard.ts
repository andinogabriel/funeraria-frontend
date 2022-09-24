import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';

import { AuthenticationService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private notificationService: NotificationService,
        private tokenService: TokenService,
        private authService: AuthenticationService) { }

    canActivate(): boolean {
        const token = this.tokenService.getToken()?.slice(7);
        const tokenDecoded = token && jwtDecode(token);
        if (tokenDecoded && tokenDecoded['exp']) {
            if (moment() < moment(tokenDecoded['exp']*1000)) {
                return true;
            } else {
                this.notificationService.openSnackBar('Tu sesión ha expirado.');
                this.router.navigate(['auth/iniciar-sesion']);
                return false;
            }
        }
        this.router.navigate(['auth/iniciar-sesion']);
        return false;
    }
}


