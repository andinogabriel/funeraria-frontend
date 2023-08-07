import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Affiliate } from 'src/app/features/models/affiliate';
import { MoreInfo } from 'src/app/shared/models/moreInfo';
import { getAge } from 'src/app/shared/utils/commonFunctions';

@Component({
  selector: 'app-affiliate-more-info',
  templateUrl: './affiliate-more-info.component.html',
  styleUrls: ['./affiliate-more-info.component.css']
})
export class AffiliateMoreInfoComponent implements OnInit {

  panelOpenState = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: Affiliate) {}
  affiliate: Affiliate;
  dataToShow: MoreInfo[];


  ngOnInit(): void {
    this.affiliate = this.data;
    this.initDataToShow();
  }

  private initDataToShow(): void {
    this.dataToShow = [
      { label: "Afiliador", value: this.affiliate?.user?.lastName + ' ' + this.affiliate.user.firstName},
      { label: "Parentesco", value: this.affiliate.relationship.name },
      { label: "DNI", value: this.affiliate.dni },
      { label: "Sexo", value: this.affiliate.gender.name },
      { label: "Edad", value:  getAge(this.affiliate.birthDate)},
      { label: "Fecha de nacimiento", value: this.affiliate.birthDate },
      { label: "Fecha de ingreso", value: this.affiliate.startDate },
    ];
  }


}
