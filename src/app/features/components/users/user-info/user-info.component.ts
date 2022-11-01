import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { User } from "src/app/shared/models/user";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.css"],
})
export class UserInfoComponent implements OnInit {
  panelOpenState = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: User) {}
  user: User;

  userInfos: { label: string; name: string }[] = [];

  ngOnInit(): void {
    this.user = this.data;
    this.initUserInfo();
  }

  private initUserInfo() {
    this.userInfos = [
      { label: "Email", name: this.user.email },
      { label: "Fecha de registro", name: this.user.startDate },
      {
        label: "Roles",
        name: this.user.roles
          .map(
            (rol) => this.getRoleName(rol.name))
          .join(", "),
      },
    ];
  }

  private getRoleName(roleName: string): string {
    return (
      roleName.replace("ROLE_", "").charAt(0) +
      roleName.replace("ROLE_", "").slice(1).toLowerCase()
    );
  }
}
