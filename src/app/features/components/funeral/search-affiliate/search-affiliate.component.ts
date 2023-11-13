import {
  Component,
  OnInit,
} from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { first } from "rxjs";
import { TokenService } from "src/app/core/services/token.service";
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
  isAdmin: boolean;

  constructor(
    private affiliateService: AffiliateService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SearchAffiliateComponent>,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isAdmin = this.tokenService.isAdmin();
      !!!this.isAdmin && this.getUserAffiliates();
    });
  }

  selectAffiliate(affiliate: Affiliate) {
    this.selectedAffiliate = affiliate;
  }

  sendSelectedAffiliate(): void {
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
          error: (err) =>
            this.snackbarService.error(
              err?.error?.message
                ? err?.error?.message
                : `Hubo un error al buscar afiliados con el valor: ${this.value}`
            ),
        });
    }
  }

  private getUserAffiliates(): void {
    this.affiliateService
      .getAffiliatesByUser()
      .pipe(first())
      .subscribe({
        next: (affiliates) => {
          this.dataSource = affiliates;
        },
        error: (err) =>
          this.snackbarService.error(
            err?.error?.message
              ? err?.error?.message
              : "Hubo un error al buscar los afiliados del usuario logueado actualmente."
          ),
      });
  }
}
