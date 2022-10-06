import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IncomeToShow } from "src/app/shared/models/income";

@Component({
  selector: "app-income-more-info",
  templateUrl: "./income-more-info.component.html",
  styleUrls: ["./income-more-info.component.css"],
})
export class IncomeMoreInfoComponent implements OnInit {
  panelOpenState = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: IncomeToShow) {}
  income: IncomeToShow;
  dataToShow: { keyName: string; valueName: string | number }[];

  ngOnInit(): void {
    this.income = this.data;
    this.initDataToShow();
  }

  private initDataToShow(): void {
    this.dataToShow = [
      { keyName: "Numero de serie", valueName: this.income.receiptSeries },
      { keyName: "Fecha de ingreso", valueName: this.income.incomeDate },
      { keyName: "Impuesto", valueName: this.income.tax },
      { keyName: "Monto total", valueName: this.income?.totalAmount },
      { keyName: "Proveedor", valueName: this.income?.supplier },
      {
        keyName: "Usuario del ingreso",
        valueName:
          this.income?.incomeUser?.lastName +
          " " +
          this.income?.incomeUser?.firstName,
      },
      { keyName: "Tipo de recibo", valueName: this.income?.receiptType }
    ];
  }
}
