import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { TokenService } from 'src/app/core/services/token.service';
;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  mobileQuery: MediaQueryList;
  title = 'my-app';
  isShowHideFlag = "over";
  isLogged: boolean;
  screenHeight: number;
  slides = [
    {path: 'https://efuneraria.com/wp-content/uploads/2022/02/que-es-una-funeraria.jpg'}, 
    {path: 'https://www.ecured.cu/images/b/bf/Funeraria_1.jpg'},
    {path: 'https://capillasdelafe.com/funerarias/static_files/xeik-admin/upload/upload/1521660542_MG_0113.jpg'}, 
    {path: 'https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2020/03/24/una-funeraria-de-madrid.jpeg'}
  ];
  listNavItems = [
    {scrollTo: 'form', label: 'Link 1'}
  ]
  matInterval = 4500;
  matProportion = 25;

  constructor(
    private viewportScroller: ViewportScroller, 
    private tokenService: TokenService,
    private router: Router,
    public spinnerService: SpinnerService,
    ) {}
   
  ngOnInit(): void {
    this.screenHeight = window.innerHeight;
    this.isLogged = !!this.tokenService.getToken();
  }
  

  scrollDrawerTo(name: string, mobile?: boolean) {
    mobile && this.sidenav?.close();
    this.viewportScroller?.scrollToAnchor(name);
  }

  scrollToLoginOrDashboard() {
    this.drawer?.toggle();
    this.router.navigate([!this.isLogged ? "'/auth/iniciar-sesion'" : "'/dashboard'"]);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenHeight = window.innerHeight;
  }

}
