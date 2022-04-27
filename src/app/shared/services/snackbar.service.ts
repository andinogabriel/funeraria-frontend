import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  error(message: string) {
    return this._snackBar.open(message, "Cerrar", {
      duration: 5000,
      verticalPosition: "bottom",
      panelClass: ["snackbar-error"],
    });
  }

  success(message: string) {
    return this._snackBar.open(message, "Cerrar", {
      duration: 4500,
      verticalPosition: "bottom",
      panelClass: ["snackbar-success"],
    });
  }

  info(message: string) {
    return this._snackBar.open(message, "Cerrar", {
      duration: 4500,
      verticalPosition: "bottom",
      panelClass: ["snackbar-info"],
    });
  }
}
