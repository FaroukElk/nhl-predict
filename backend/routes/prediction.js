const request = require("request");
const Prediction = require("../models/prediction");
const User = require("../models/user");
const express = require("express");
const helper = require('../js/functions');
const router = express.Router();

router.get("/:id", (req, res, next) => {
  let [year,month,day] = req.query.date.split('-');
  const dateStart = new Date(year, month-1, day);
  dateStart.setHours(0,0,0,0);
  const dateEnd = new Date();
  dateEnd.setHours(0,0,0,0);
  dateEnd.setDate(dateStart.getDate() + 1);
  request({uri: `https://statsapi.web.nhl.com/api/v1/schedule?date=${req.query.date}`, json: true},
    (error, response, body) => {
      const games = [];
      const totalGames = body.totalGames;
      for (let i = 0; i < totalGames; i++) {
        const gameData = body.dates[0].games[i];
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
        games.push(game);
      }
      Prediction.find({gameDate: {$gte: dateStart, $lte: dateEnd}, userId: req.params.id})
        .then(result => {
          res.status(200).json({
            predictionList: result,
            gameList: games,
            message: "success"
          });
      });
    });
  });

router.post("/predictions", (req, res, next) => {
  Prediction.insertMany(req.body)
    .then(result => {
      res.status(201).json({
        message: 'predictions saved',
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.put("/predictions", (req, res, next) => {
  const bulkOps = req.body.map((prediction) => {
    return {
      "updateOne": {
        "filter": { "_id": prediction._id},
        "update": { "$set": { "predictedWinner": prediction.predictedWinner }}
      }
    };
  });

  Prediction.bulkWrite(bulkOps, { "ordered": true, w: 1}, (err, result) => {
    res.status(204).json({
      message: 'predictions updated',
      result: result
    });
  });
});


module.exports = router;
