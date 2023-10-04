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
    {path: 'https://i.ibb.co/KLLK7jj/2.png" alt="2'}, 
    {path: 'https://i.ibb.co/BZCYHcH/4.png" alt="4'},
    {path: 'https://i.ibb.co/gP1Gdwq/5.png" alt="5'}, 
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