import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { StatsService } from '../game-list/stats.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  authStatusSub: Subscription;
  username: string;
  userPoints: number;
  userStatsSub: Subscription;

  constructor(private authService: AuthService, private statsService: StatsService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.getAuthStatus();
    this.isAuthenticated ? this.username = this.authService.getUsername() : this.username = '';
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
