import { Component, OnInit, OnDestroy, Renderer2, ChangeDetectorRef } from '@angular/core';
import { GamesService } from './games.service';
import { Game } from './game.model';
import { Subscription } from 'rxjs';
import { Prediction } from './prediction.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {
  dateCursor: Date = new Date();
  dateToday: Date = new Date();

  year = this.dateToday.getFullYear();
  day = this.dateToday.getDate();
  month = this.dateToday.getMonth() + 1;
  gameList: Game[];
  gamesSub: Subscription;
  predictionsSub: Subscription;
  dateString: string;
  isLoading: boolean = false;
  predictionList: Prediction[];
  userId: string;
  saveMode: string = 'create';

  constructor(private renderer: Renderer2,
    private gamesService: GamesService,
    private authService: AuthService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.isLoading = true;
    this.dateCursor.setHours(0,0,0,0);
    this.dateToday.setHours(0,0,0,0);
    this.dateString = this.getDateString();
    this.userId = this.authService.getUserId();
    this.gamesSub = this.gamesService.getGameUpdateListener()
      .subscribe(result => {
        this.isLoading = false;
        this.gameList = result.games;
        this.predictionList = result.predictions;
        this.ref.detectChanges();
      });
    this.gamesService.getGames(this.dateString, this.userId);
  }

  ngOnDestroy() {
    this.gamesSub.unsubscribe();
  }

  checkGameDate() {
    if (this.dateCursor.getTime() >= this.dateToday.getTime()){
      return true;
    }
    else {
      return false;
    }
  }

  getDateString() {
    let dateString = this.year + '-';
    if (this.month  < 10){
      dateString = dateString + '0';
    }
    dateString = dateString + this.month + '-';
    if (this.day < 10){
      dateString = dateString + '0';
    }
    dateString = dateString + this.day;
    return dateString;
  }

  onDatepickerChange(date: Date) {
    this.isLoading = true;
    this.dateCursor = date;
    this.year = this.dateCursor.getFullYear();
    this.day = this.dateCursor.getDate();
    this.month = this.dateCursor.getMonth() + 1;
    this.dateString = this.getDateString();
    this.gamesService.getGames(this.dateString, this.userId);
  }

  onScheduleDateChange(past: boolean) {
    this.isLoading = true;
    if (past) {
      this.dateCursor.setDate(this.dateCursor.getDate() - 1);
    }
    else {
      this.dateCursor.setDate(this.dateCursor.getDate() + 1);
    }
    this.year = this.dateCursor.getFullYear();
    this.day = this.dateCursor.getDate();
    this.month = this.dateCursor.getMonth() + 1;
    this.dateString = this.getDateString();
    this.gamesService.getGames(this.dateString, this.userId);
  }

  onSelected(teamId: number, index: number) {
    if (!this.checkGameDate() || !this.userId) {
      return;
    }
    if (this.saveMode === 'create') {
      const prediction = {
        predictedWinner: teamId,
        gameDate: this.gameList[index].gameDate,
        gameId: this.gameList[index].gameId,
        userId: this.userId,
        actualWinner: null
      }
      this.predictionList[index] = prediction;
    }
    else {
      this.predictionList[index].predictedWinner = teamId;
    }
  }

  isSelected(teamId: number, index: number) {
    if (typeof this.predictionList === 'undefined' || typeof this.predictionList[index] === 'undefined') {
      return false;
    }
    if (this.predictionList[index].predictedWinner === teamId) {
      return true;
    }
    else {
      return false;
    }
  }

  onSubmitPrediction() {
    if (this.saveMode === 'create') {
      this.gamesService.savePredictions(this.predictionList);
    }
    else {
      this.gamesService.updatePredictions(this.predictionList);
    }
  }

  isWrongPrediction(teamId: number, index: number) {
    if (!this.predictionList[index]) {
      return false;
    }
    else {
      if (this.predictionList[index].predictedWinner === this.predictionList[index].actualWinner) {
        return false;
      }
      else {
        if (this.predictionList[index].predictedWinner === teamId) {
          return true;
        }
        return false;
      }
    }
  }
}
