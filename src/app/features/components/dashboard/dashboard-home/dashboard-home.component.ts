import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Title } from '@angular/platform-browser';
import { NGXLogger } from 'ngx-logger';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  currentUser: any;

  constructor(private notificationService: NotificationService,
    private authService: AuthenticationService,
    private titleService: Title,
    private logger: NGXLogger) {
  }

  ngOnInit() {
    this.getCurrentUser();
    this.titleService.setTitle('funeraria-frontend - Dashboard');
    this.logger.log('Dashboard loaded');
  }

  private getCurrentUser(): void {
    this.authService.getCurrentUser()
      .pipe(first())
      .subscribe({
        next: (user) => this.currentUser = `${user.lastName} ${user.firstName}`,
        error: (err) => this.logger.log(err?.error)
      })
  }


}
