import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { TokenService } from "../services/token.service";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate() {
    const token = this.tokenService.getToken();
    if (token && this.tokenService.isAdmin()) {
      return true;
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }

}
