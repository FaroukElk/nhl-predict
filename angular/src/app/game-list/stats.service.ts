import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getUserStatsListener() {
    return this.userStatsListener;
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
}
