import { Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { map, Observable, take } from "rxjs";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

interface optionArguments {
  confirmText: string;
  message: string;
  title: string;
}

@Injectable({
  providedIn: "root",
})
export class ConfirmDialogService {
  private dialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private dialog: MatDialog) {}

  open(options: optionArguments) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        confirmText: options.confirmText,
        message: options.message,
        title: options.title,
      },
    });
  }

  confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1),
      map((res) => res)
    );
  }
  
}
