import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { timer } from "rxjs";
import { Subscription } from "rxjs";

import { AuthenticationService } from "src/app/core/services/auth.service";
import { SpinnerService } from "../../core/services/spinner.service";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { CurrentUser } from "../models/currentUser";
import { ROLE_ADMIN } from "src/app/config/app";
import { TokenService } from "src/app/core/services/token.service";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"],
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  showSpinner: boolean = false;
  userName: string = "";
  isAdmin: boolean = false;
  adminRol = ROLE_ADMIN;

  routerLinks = [
    {
      line: "Dashboard",
      routerLink: "dashboard",
      icon: "dashboard",
      roles: ["ROLE_ADMIN", "ROLE_USER"],
    },
    {
      line: "Categorias",
      routerLink: "categorias",
      icon: "category",
      roles: ["ROLE_ADMIN"],
    },
    {
        line: "Articulos",
        routerLink: "articulos",
        icon: "list_alt",
        roles: ["ROLE_ADMIN"],
    },
    {
        line: "Marcas",
        routerLink: "marcas",
        icon: "branding_watermark",
        roles: ["ROLE_ADMIN"],
    },
    {
      line: "Ingresos",
      routerLink: "ingresos",
      icon: "next_week",
      roles: ["ROLE_ADMIN"],
    },
    {
      line: "Proveedores",
      routerLink: "proveedores",
      icon: "local_shipping",
      roles: ["ROLE_ADMIN"],
    },
    {
      line: "Planes",
      routerLink: "planes",
      icon: "assignment",
      roles: ["ROLE_ADMIN"],
    },
    {
      line: "Usuarios",
      routerLink: "usuarios",
      icon: "people",
      roles: ["ROLE_ADMIN"],
    },
    {
      line: "Afiliados",
      routerLink: "afiliados",
      icon: "supervised_user_circle",
      roles: ["ROLE_ADMIN", "ROLE_USER"],
    },
    {
      line: "Funerales",
      routerLink: "funerales",
      icon: "featured_play_list",
      roles: ["ROLE_ADMIN", "ROLE_USER"],
    },
    {
      line: "Mi cuenta",
      routerLink: "mi-cuenta",
      icon: "person",
      roles: ["ROLE_ADMIN", "ROLE_USER"],
    },
  ];

  private autoLogoutSubscription: Subscription = new Subscription();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    public spinnerService: SpinnerService,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private authGuard: AuthGuard
  ) {
    this.mobileQuery = this.media.matchMedia("(max-width: 1000px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.setCurrentUser();
    // Auto log-out subscription
    const timer$ = timer(2000, 5000);
    this.autoLogoutSubscription = timer$.subscribe(() => {
      this.authGuard.canActivate();
    });
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.autoLogoutSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  private setCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: CurrentUser) => {
        this.isAdmin = user.roles.some((r) => r.name === "ROLE_ADMIN");
        this.userName = `${user.lastName} ${user.firstName}`;
      },
      error: (error) => console.log(error?.error),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
