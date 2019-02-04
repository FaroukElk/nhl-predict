import { Injectable } from '@angular/core';
import { Game } from './game.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Prediction } from './prediction.model';

@Injectable({providedIn: 'root'})
export class GamesService {
  private games: Game[] = [];
  private predictions: Prediction[] = [];
  private gamesUpdated = new Subject<{games: Game[], predictions: Prediction[]}>();

  constructor(private http: HttpClient) {}

  getGames(date: string, userId: string) {
    this.games = [];
    if (userId) {
      this.http.get<{predictionList: Prediction[], gameList: Game[]}>('http://localhost:3000/games/' + userId + "?date=" + date)
        .subscribe(response => {
          this.games = response.gameList;
          this.games.forEach(game => {
            game.gameDate = new Date(game.gameDate);
          })
          this.predictions = response.predictionList;
          this.gamesUpdated.next({games: [...this.games], predictions: [...this.predictions]});
        });
    }
    else {
      this.http.get<{totalGames: number, dates: { games: {}}}>("https://statsapi.web.nhl.com/api/v1/schedule?date=" + date)
        .subscribe(data => {
          const totalGames = data.totalGames;
          for (let i = 0; i < totalGames; i++) {
            const gameData = data.dates[0].games[i];
            const game = {
              gameId: gameData.gamePk,
              gameDate: new Date(gameData.gameDate),
              status: gameData.status.detailedState,
              awayTeam: {
                id: gameData.teams.away.team.id,
                name: gameData.teams.away.team.name,
                record: {
                  wins: gameData.teams.away.leagueRecord.wins,
                  losses: gameData.teams.away.leagueRecord.losses,
                  ot: gameData.teams.away.leagueRecord.ot,
                },
                score: gameData.teams.away.score
              },
              homeTeam: {
                id: gameData.teams.home.team.id,
                name: gameData.teams.home.team.name,
                record: {
                  wins: gameData.teams.home.leagueRecord.wins,
                  losses: gameData.teams.home.leagueRecord.losses,
                  ot: gameData.teams.home.leagueRecord.ot,
                },
                score: gameData.teams.home.score
              }
            };
            this.games.push(game);
          }
          this.gamesUpdated.next({games: [...this.games], predictions: []});
        });
    }
  }

  getGameUpdateListener() {
    return this.gamesUpdated.asObservable();
  }

  savePredictions(predictions: Prediction[]) {
    this.http.post("http://localhost:3000/games/predictions", predictions)
      .subscribe((result) => {
        console.log(result);
      });
  }

  updatePredictions(predictions: Prediction[]) {
    console.log(predictions);
    this.http.put("http://localhost:3000/games/predictions", predictions)
      .subscribe((result) => {
        console.log(result);
      });
  }
}
