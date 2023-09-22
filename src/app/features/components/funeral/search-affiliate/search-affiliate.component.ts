import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { first } from "rxjs";
import { Affiliate } from "src/app/features/models/affiliate";
import { AffiliateService } from "src/app/features/services/affiliate.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-search-affiliate",
  templateUrl: "./search-affiliate.component.html",
  styleUrls: ["./search-affiliate.component.css"],
})
export class SearchAffiliateComponent implements OnInit {
  value = "";
  dataSource: Affiliate[] = [];
  selectedAffiliate: Affiliate;

  constructor(
    private affiliateService: AffiliateService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SearchAffiliateComponent>
  ) {}

  ngOnInit(): void {}

  selectAffiliate(affiliate: Affiliate) {
    this.selectedAffiliate = affiliate;
  }

  sendSelectedAffiliate(): void {
    console.log(this.selectedAffiliate);
    this.dialogRef.close(this.selectedAffiliate);
  }

  searchAffiliate(): void {
    if (this.value.trim().length > 0) {
      this.affiliateService
        .findAffiliatesByFirstNameOrLastNameOrDniContaining(this.value)
        .pipe(first())
        .subscribe({
          next: (affiliates) => {
            this.dataSource = affiliates;
          },
          error: (err) => this.snackbarService.error(err?.error?.message ? err?.error?.message : `Hubo un error al buscar afiliados con el valor: ${this.value}`)
        });
    }
  }
}
