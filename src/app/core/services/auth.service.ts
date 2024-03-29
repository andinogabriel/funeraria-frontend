import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { delay } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { of, Observable } from "rxjs";
import { LoginUser } from "src/app/shared/models/loginUser";
import { Jwt } from "src/app/shared/models/jwt";
import { CurrentUser } from "src/app/shared/models/currentUser";
import { withCache } from "@ngneat/cashew";
import { ResetPassword } from "src/app/shared/models/resetPassword";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private baseUrl = `${environment.baseUrl}/users`;
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
  //ResetPassword
  changePassword(resetPassword: ResetPassword): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.baseUrl}/reset-password`, resetPassword, {headers: this.headers});
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

