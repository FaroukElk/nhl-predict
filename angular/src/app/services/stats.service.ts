import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({providedIn: 'root'})
export class StatsService {
  private userStats: {
    points: number,
    correct: number,
    wrong: number,
    ratio: number
  };
  private userStatsListener = new Subject<{
    points: number,
    correct: number,
    wrong: number,
    ratio: number
  }>()
  leaderboard: User[];
  leaderboardsUpdated = new Subject<User[]>();

  constructor(private http: HttpClient) {}

  getUserStatsListener() {
    return this.userStatsListener;
  }

  getLeaderboardsUpdatedListener() {
    return this.leaderboardsUpdated.asObservable();
  }

  requestUserStats(userId: string) {
    this.http.get<{
      userStats: {points: number, correct: number, wrong: number, ratio: number}
    }>("http://localhost:3000/users/stats/" + userId)
      .subscribe(response => {
        console.log(response);
        this.userStats = response.userStats;
        this.userStatsListener.next(response.userStats);
      });
  }

  getLeaderboardData(page: number) {
    this.http.get<User[]>('http://localhost:3000/users/leaderboard/top?page=' + page)
      .subscribe((response) => {
        this.leaderboardsUpdated.next(response);
      });
  }
}
