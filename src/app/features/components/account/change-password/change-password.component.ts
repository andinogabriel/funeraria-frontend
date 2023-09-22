import { Validators, FormGroup, FormControl } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { NGXLogger } from "ngx-logger";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { NotificationService } from "src/app/core/services/notification.service";
import { SpinnerService } from "src/app/core/services/spinner.service";
import { CurrentUser } from "src/app/shared/models/currentUser";
import { ResetPassword } from "src/app/shared/models/resetPassword";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { mustMatch } from "src/app/shared/utils/validators";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  form!: FormGroup;
  hideCurrentPassword: boolean;
  hideNewPassword: boolean;
  currentPassword!: string;
  email!: string;
  newPassword!: string;
  newPasswordConfirm!: string;
  disableSubmit!: boolean;

  constructor(
    private authService: AuthenticationService,
    private logger: NGXLogger,
    private spinnerService: SpinnerService,
    private snackbarService: SnackbarService
  ) {
    this.hideCurrentPassword = true;
    this.hideNewPassword = true;
  }

  ngOnInit() {
    this.form = new FormGroup(
      {
        currentPassword: new FormControl<string | null>(
          "",
          Validators.required
        ),
        newPassword: new FormControl<string | null>("", [
          Validators.required,
          Validators.minLength(8),
        ]),
        newPasswordConfirm: new FormControl<string | null>("", [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      mustMatch("newPassword", "newPasswordConfirm")
    );

    this.setCurrentUser();
    this.setCurrentFormValues();

    this.spinnerService.visibility.subscribe((value) => {
      this.disableSubmit = value;
    });
  }

  changePassword() {
    if (this.newPassword !== this.newPasswordConfirm) {
      this.snackbarService.error("La nueva contraseña no coincide.");
      return;
    }
    const passwordReset: ResetPassword = {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword,
      matchingNewPassword: this.newPasswordConfirm,
    };
    this.authService.changePassword(passwordReset).subscribe({
      next: () => {
        this.logger.info(`User ${this.email} changed password.`);
        this.form.reset();
        this.snackbarService.success(
          "Tu contraseña ha sido actualizada satisfactoriamente."
        );
      },
      error: (err) =>
        this.snackbarService.error(
          err?.error?.message
            ? err?.error?.message
            : "Hubo un error al tratar de cambiar su contraseña"
        ),
    });
  }

  private setCurrentFormValues(): void {
    this.form.get("currentPassword")?.valueChanges.subscribe((val: string) => {
      this.currentPassword = val;
    });
    this.form.get("newPassword")?.valueChanges.subscribe((val: string) => {
      this.newPassword = val;
    });
    this.form
      .get("newPasswordConfirm")
      ?.valueChanges.subscribe((val: string) => {
        this.newPasswordConfirm = val;
      });
  }

  private setCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: CurrentUser) => {
        this.email = user.email;
      },
      error: (error) => console.log(error?.error),
    });
  }
}
