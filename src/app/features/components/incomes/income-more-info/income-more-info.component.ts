import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IncomeToShow } from "src/app/shared/models/income";
import { MoreInfo } from "src/app/shared/models/moreInfo";

@Component({
  selector: "app-income-more-info",
  templateUrl: "./income-more-info.component.html",
  styleUrls: ["./income-more-info.component.css"],
})
export class IncomeMoreInfoComponent implements OnInit {
  panelOpenState = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: IncomeToShow) {}
  income: IncomeToShow;
  dataToShow: MoreInfo[];

  ngOnInit(): void {
    this.income = this.data;
    this.initDataToShow();
  }

  private initDataToShow(): void {
    this.dataToShow = [
      { label: "Numero de serie", value: this.income.receiptSeries },
      { label: "Fecha de ingreso", value: this.income.incomeDate },
      { label: "Impuesto", value: this.income.tax },
      { label: "Monto total", value: this.income?.totalAmount },
      { label: "Proveedor", value: this.income?.supplier },
      {
        label: "Usuario del ingreso",
        value:
          this.income?.incomeUser?.lastName +
          " " +
          this.income?.incomeUser?.firstName,
      },
      { label: "Tipo de recibo", value: this.income?.receiptType }
    ];
  }
}
