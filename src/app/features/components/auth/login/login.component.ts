import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { TokenService } from "src/app/core/services/token.service";
import { LoginUser } from "src/app/shared/models/loginUser";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { DeviceInfo } from "src/app/shared/models/deviceInfo";
import { DeviceUUID } from "device-uuid";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  title = "Funeraria Nuñez y Hnos.";
  subTitle = "Volver al inicio";
  loginForm!: FormGroup;
  loading!: boolean;
  isLogged = false;
  loginUser: LoginUser;
  loginErrMessage: string;
  deviceInfo: DeviceInfo = null;

  loginInputs = [
    {
      name: 'email', label: 'Email', type: 'email',
      errors: [
        {name: 'required', message: 'El email es requerido.'},
        {name: 'email', message: 'Ingrese un formato valido de email.'},
      ]
    },
    {
      name: 'password', label: 'Contraseña', type: 'password',
      errors: [
        {name: 'required', message: 'La contraseña es requerida.'},
      ]
    },
  ]

  constructor(
    private router: Router,
    private titleService: Title,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.titleService.setTitle("Iniciar Sesión");
    this.authenticationService.logout();
    this.createForm();
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  private createForm() {
    const savedUserEmail = localStorage.getItem("savedUserEmail");
    this.loginForm = new FormGroup({
      email: new FormControl<string | null>(savedUserEmail, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string | null>("", Validators.required),
      rememberMe: new FormControl<boolean | null>(savedUserEmail !== null),
    });
  }

  login(): void {
    console.log(this.deviceInfo);
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;
    const rememberMe = this.loginForm.get("rememberMe")?.value;
    const deviceInfo = {
      deviceId: new DeviceUUID().get(),
      deviceType: `${this.deviceInfo?.os_version}-${this.deviceInfo?.deviceType}-${this.deviceInfo?.browser}-v${this.deviceInfo?.browser_version}`
    }
    this.loginUser = new LoginUser(email, password, deviceInfo);
    this.authenticationService.login(this.loginUser)
      .subscribe({
        next: (data) => {
          this.isLogged = true;
          this.tokenService.setToken(data?.authorization);
          rememberMe ? localStorage.setItem("savedUserEmail", email)
            : localStorage.removeItem("savedUserEmail");
          this.router.navigate(["/dashboard"]);
        },
        error: (errr: any) => {
          this.isLogged = false;
          this.loginErrMessage = errr?.error?.message;
          this.snackbarService.error(this.loginErrMessage);
        }
      })
  }

  resetPassword() {
    this.router.navigate(["/auth/password-reset-request"]);
  }

  signup() {
    this.router.navigate(["/auth/registrarse"]);
  }

}
