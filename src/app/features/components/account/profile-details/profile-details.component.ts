import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { CurrentUser } from "src/app/shared/models/currentUser";

@Component({
  selector: "app-profile-details",
  templateUrl: "./profile-details.component.html",
  styleUrls: ["./profile-details.component.css"],
})
export class ProfileDetailsComponent implements OnInit {
  fullName: string = "";
  email: string = "";
  alias: string = "";

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  private setCurrentUser(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: CurrentUser) => {
        this.email = user.email;
        this.fullName = `${user.lastName} ${user.firstName}`;
      },
      error: (error) => console.log(error?.error),
    });
  }
}
