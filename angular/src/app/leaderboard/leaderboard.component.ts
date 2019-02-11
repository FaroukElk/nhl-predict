import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { StatsService } from '../services/stats.service';
import { PageEvent, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaders: MatTableDataSource<User>;
  leaderBoardSub: Subscription;
  columnsToDisplay = ['position', 'username', 'correct', 'wrong', 'ratio', 'points'];
  currentPage = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private statsService: StatsService) { }

  ngOnInit() {
    this.leaderBoardSub = this.statsService.getLeaderboardsUpdatedListener()
      .subscribe(leaders => {
        this.leaders = new MatTableDataSource(leaders);
        setTimeout(() => {
          this.leaders.paginator = this.paginator;
          this.leaders.sort = this.sort;
        });
      });
    this.statsService.getLeaderboardData(this.currentPage);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
  }

}
