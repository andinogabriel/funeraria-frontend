import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuneralResponse } from 'src/app/shared/models/funeral';
import { MoreInfo } from 'src/app/shared/models/moreInfo';

@Component({
  selector: 'app-funeral-more-info',
  templateUrl: './funeral-more-info.component.html',
  styleUrls: ['./funeral-more-info.component.css']
})
export class FuneralMoreInfoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: FuneralResponse) {}
  funeral: FuneralResponse;
  dataToShow: MoreInfo[];

  ngOnInit(): void {
    this.funeral = this.data;
    this.initDataToShow();
  }

  private initDataToShow(): void {
    this.dataToShow = [
      { label: "Fecha del sepelio", value: this.funeral?.funeralDate },
      { label: "Plan", value: this.funeral?.plan },
      { label: "Fecha de registro del sepelio", value: this.funeral?.registerDate },
      { label: "Monto total", value: this.funeral?.totalAmount },
    ];
  }


}
