import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { delay, map } from "rxjs/operators";
import * as moment from "moment";

import { environment } from "../../../environments/environment";
import { of, EMPTY, Observable } from "rxjs";
import { BASE_ENDPOINT } from "src/app/config/app";
import { LoginUser } from "src/app/shared/models/loginUser";
import { Jwt } from "src/app/shared/models/jwt";
import { CurrentUser } from "src/app/shared/models/currentUser";
import { withCache } from "@ngneat/cashew";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private baseUrl = `${BASE_ENDPOINT}/users`;
  private headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(
    private http: HttpClient,
    @Inject("LOCALSTORAGE") private localStorage: Storage
  ) {}

  login(loginUser: LoginUser): Observable<Jwt> {
    return this.http.post<Jwt>(`${this.baseUrl}/login`, loginUser, {headers: this.headers});
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`, {
      context: withCache()
    });
  }

  /*login(email: string, password: string) {
    return this.http
      .post<any>(`${this.baseUrl}/login`, { email, password })
      .subscribe((response) => {
        localStorage.setItem("access_token", response.authorization);
        const decodedToken = jwt_decode(response["authorization"]);
        console.log(decodedToken);
      });
  }*/

  logout(): void {
    // clear token remove user from local storage to log user out
    this.localStorage.removeItem("authorization");
  }

  
  passwordResetRequest(email: string) {
    return of(true).pipe(delay(1000));
  }

  changePassword(email: string, currentPwd: string, newPwd: string) {
    return of(true).pipe(delay(1000));
  }

  passwordReset(
    email: string,
    token: string,
    password: string,
    confirmPassword: string
  ): any {
    return of(true).pipe(delay(1000));
  }
}

