import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { StatsService } from './stats.service';
import { GamesService } from './games.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private username: string;
  private tokenTimer;
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<{authenticated: boolean, username: string}>();

  constructor(private http: HttpClient, private router: Router,
    private statsService: StatsService, private gamesService: GamesService) {}

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return {
      authenticated: this.isAuthenticated,
      username: this.username,
      userId: this.userId
    };
  }

  getUserId() {
    return this.userId;
  }

  getUsername() {
    return this.username;
  }

  getAuthStatusListener() {
    return this.authStatusListener;
  }

  createUser(username: string, email: string, password: string) {
    const userData = { username: username, email: email, password: password };
    this.http.post('http://localhost:3000/users/signup', userData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(username: string, password: string) {
    const userData = { username: username, password: password };
    this.http.post<{token: string, expiresIn: number, userId: string, username: string}>('http://localhost:3000/users/login', userData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.statsService.requestUserStats(response.userId);
          this.authStatusListener.next({authenticated: true, username: response.username});
          this.userId = response.userId;
          this.username = response.username;
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId, this.username);
          this.router.navigate(['/']);
        }
      })
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    console.log(authInfo);
    if (!authInfo) {
      return
    }
    const now = new Date();
    const timeValid = authInfo.expirationDate.getTime() - now.getTime();
    console.log(authInfo.expirationDate.getHours());
    if (timeValid > 0) {
      console.log("Authenticated");
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.username = authInfo.username;
      console.log(this.username);
      this.userId = authInfo.userId;
      this.setAuthTimer(timeValid / 1000);
      this.statsService.requestUserStats(this.userId);
      this.authStatusListener.next({authenticated: true, username: this.username});
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next({authenticated: false, username: ""});
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.gamesService.resetPredictions();
    this.router.navigate(['/']);
  }

  saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      username: username
    };
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }
}
