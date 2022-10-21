import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';import { MatDrawer } from '@angular/material/sidenav';
;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  title = 'my-app';
  isShowHideFlag = "over";
  slides = [
    {path: 'https://efuneraria.com/wp-content/uploads/2022/02/que-es-una-funeraria.jpg'}, 
    {path: 'https://www.ecured.cu/images/b/bf/Funeraria_1.jpg'},
    {path: 'https://capillasdelafe.com/funerarias/static_files/xeik-admin/upload/upload/1521660542_MG_0113.jpg'}, 
    {path: 'https://imagenes.20minutos.es/files/og_thumbnail/uploads/imagenes/2020/03/24/una-funeraria-de-madrid.jpeg'}
  ];
  matInterval = 4500;
  matProportion = 25;

  constructor(private viewportScroller: ViewportScroller) {}
   
  ngOnInit(): void {
  }

  showHide() {
  }

  scrollTo(name: string) {
    this.viewportScroller.scrollToAnchor(name);
  }

  scrollDrawerTo(name: string) {
    this.viewportScroller.scrollToAnchor(name);
    this.drawer.toggle();
  }

}
