import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GamesService } from '../services/games.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../services/users.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: string;
  userData: User;
  userRetrievedSub: Subscription;
  predictions: MatTableDataSource<{}>;
  currentPage = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  columnsToDisplay = ['position', 'gameDate', 'awayTeam', 'homeTeam', 'correct'];

  constructor(private usersService: UsersService,
    private route: ActivatedRoute,
    private http: HttpClient) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.userRetrievedSub = this.usersService.getUserRetrievedListener()
      .subscribe(response => {
        this.userData = response.user;
        this.predictions = new MatTableDataSource(response.predictions);
        this.predictions.paginator = this.paginator;
        this.predictions.sort = this.sort;
      });
    this.usersService.getUser(this.userId);
  }

}
