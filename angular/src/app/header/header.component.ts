import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  authStatusSub: Subscription;
  username: string;
  userId: string;
  userPoints: number;
  userStatsSub: Subscription;

  constructor(private authService: AuthService, private statsService: StatsService) { }

  ngOnInit() {
    const authStatus = this.authService.getAuthStatus();
    this.isAuthenticated = authStatus.authenticated;
    this.username = authStatus.username;
    this.userId = authStatus.userId;
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth.authenticated;
        this.username = isAuth.username;
      });
    this.userStatsSub = this.statsService.getUserStatsListener()
      .subscribe(userStats => {
        this.userPoints = userStats.points;
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
