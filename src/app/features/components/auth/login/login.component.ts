import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { NotificationService } from "src/app/core/services/notification.service";
import { TokenService } from "src/app/core/services/token.service";
import { LoginUser } from "src/app/shared/models/loginUser";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading!: boolean;
  isLogged = false;
  loginUser: LoginUser;
  loginErrMessage: string;


  constructor(
    private router: Router,
    private titleService: Title,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.titleService.setTitle("Iniciar Sesión");
    this.authenticationService.logout();
    this.createForm();
  }

  private createForm() {
    const savedUserEmail = localStorage.getItem("savedUserEmail");
    this.loginForm = new FormGroup({
      email: new FormControl(savedUserEmail, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl("", Validators.required),
      rememberMe: new FormControl(savedUserEmail !== null),
    });
  }

  login(): void {
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;
    const rememberMe = this.loginForm.get("rememberMe")?.value;
    this.loginUser = new LoginUser(email, password);
    this.authenticationService.login(this.loginUser)
      .subscribe({
        next: (data) => {
          this.isLogged = true;
          this.tokenService.setToken(data?.authorization);
          if (rememberMe) {
            localStorage.setItem("savedUserEmail", email);
          } else {
            localStorage.removeItem("savedUserEmail");
          }
          this.router.navigate(["/"]);
        },
        error: (error: any) => {
          console.log(error);
          this.isLogged = false;
          this.loginErrMessage = error?.error?.message;
          this.snackbarService.error(this.loginErrMessage);
        }
      })
  }

  /*
  login() {
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;
    const rememberMe = this.loginForm.get("rememberMe")?.value;

    this.loading = true;
    this.authenticationService.login(email, password).subscribe({
      next: () => {
        if (rememberMe) {
          localStorage.setItem("savedUserEmail", email);
        } else {
          localStorage.removeItem("savedUserEmail");
        }
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.notificationService.openSnackBar(error);
        this.loading = false;
      },
    });
  }*/

  resetPassword() {
    this.router.navigate(["/auth/password-reset-request"]);
  }

  signup() {
    this.router.navigate(["/auth/registrarse"]);
  }


}
