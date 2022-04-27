import { Inject, Injectable } from "@angular/core";
import jwtDecode from "jwt-decode";
import { ROLE_ADMIN } from "src/app/config/app";
import { Jwt } from 'src/app/shared/models/jwt';

const TOKEN_KEY = "authorization";
const USERNAME_KEY = "email";
const AUTHORITIES_KEY = "authorities";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  roles: Array<string> = [];

  constructor(
    @Inject("LOCALSTORAGE") private localStorage: Storage
  ) {}

  public setToken(token: string): void {
    this.localStorage.removeItem(TOKEN_KEY);
    this.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return this.localStorage.getItem(TOKEN_KEY);
  }

  public setUsername(userName: string): void {
    this.localStorage.removeItem(USERNAME_KEY);
    this.localStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string {
    const token = this.localStorage.getItem(TOKEN_KEY);
    if(token) {
      const decodedToken: Jwt = jwtDecode(token.slice(7));
      return decodedToken?.email;
    }
    return null;
  }

  public getAuthorities(): string[] {
    this.roles = [];
    const token = this.localStorage.getItem(TOKEN_KEY);
    const decodedToken: Jwt = jwtDecode(token.slice(7));
    const authorities = decodedToken?.authorities.split(',');
    this.roles = authorities;
    return this.roles;
  }

  public isAdmin(): boolean {
    const roles = this.getAuthorities();
    return roles.some(r => r === ROLE_ADMIN)
  }

  public logout(): void {
    this.localStorage.clear();
  }
}
