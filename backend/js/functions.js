const Prediction = require('../models/prediction');
const User = require('../models/user');
const fetch = require('node-fetch');


const checkPredictions = function (user, predictions) {
  const urls = [];
  for (let i = 0; i < predictions.length; i++) {
    const url = "https://statsapi.web.nhl.com/api/v1/game/" + predictions[i].gameId + "/linescore";
    urls.push(url);
  }
  let promises = urls.map(url => {
    return fetchJson(url);
  });
  let current = 0;
  Promise.all(promises).then(responses => {
    responses.forEach(response => {
      if (response.teams.home.goals > response.teams.away.goals) {
        predictions[current].actualWinner = response.teams.home.team.id;
      }
      else {
        predictions[current].actualWinner = response.teams.away.team.id;
      }
      console.log(predictions[current].actualWinner);
      if (predictions[current].predictedWinner === predictions[current].actualWinner) {
        user.correct++;
        user.points += 5;
      }
      else {
        user.wrong++;
      }
      current++;
    });

    const bulkOps = predictions.map((prediction) => {
      return {
        "updateOne": {
          "filter": { "_id": prediction._id},
          "update": { "$set": { "actualWinner": prediction.actualWinner }}
        }
      };
    });

    Prediction.bulkWrite(bulkOps, { "ordered": true, w: 1}, (err, result) => {
      console.log(result);
    });
    user.ratio = user.correct / (user.correct + user.wrong);
    console.log(user);
    user.save();
    return user;
  });
}

function fetchJson(url) {
  return fetch(url).then(response => response.json());
}

module.exports = checkPredictions;
