import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
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
  lastModifiedDate: string = "";
  dataToShow: { keyName: string; valueName: string | number }[];

  ngOnInit(): void {
    this.income = this.data;
    if (this.income?.lastModifiedDate) {
      this.lastModifiedDate = moment(this.income?.lastModifiedDate).format(
        "DD/MM/YYYY - HH:mm"
      );
    }
    this.initDataToShow();
  }

  private initDataToShow(): void {
    this.dataToShow = [
      { keyName: "Numero de serie", valueName: this.income.receiptSeries },
      { keyName: "Fecha de ingreso", valueName: this.income.entryDate },
      { keyName: "Impuesto", valueName: this.income.receiptSeries },
      { keyName: "Monto total", valueName: this.income?.totalAmount },
      { keyName: "Proveedor", valueName: this.income?.supplier },
      {
        keyName: "Usuario del ingreso",
        valueName:
          this.income?.entryUser?.lastName +
          " " +
          this.income?.entryUser?.firstName,
      },
      { keyName: "Tipo de recibo", valueName: this.income?.receiptType },
    ];
  }
}
