const express = require("express");
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Prediction = require('../models/prediction');
const router = express.Router();
const checkPredictions = require('../js/functions');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const privateKey = fs.readFileSync('./private.key', 'utf-8');

router.post("/signup", (req, res, next) => {
  console.log(req.body);
  //saltOrRounds higher number is safer (and longer), math to generate random number hash
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        points: 0,
        correct: 0,
        wrong: 0,
        ratio: 0
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        {
          username: fetchedUser.username,
          userId: fetchedUser._id
        },
        privateKey,
        { expiresIn: '1h',
          algorithm: 'RS256'}
      );
      console.log(token);
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        username: fetchedUser.username,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

router.get('/stats/:id', (req, res, next) => {
  const date = new Date();
  date.setHours(0,0,0,0);
  let fetchedUser;
  User.findOne({_id: req.params.id})
    .then(user => {
      fetchedUser = user;
      return Prediction.find({ userId: req.params.id, gameDate: {$lte: date}, actualWinner: null });
    })
    .then(predictions  => {
      console.log(fetchedUser);
       if (predictions.length > 0) {
        fetchedUser = checkPredictions(fetchedUser, predictions);
      }
      res.status(200).json({
        userStats: {
          points: fetchedUser.points,
          correct: fetchedUser.correct,
          wrong: fetchedUser.wrong,
          ratio: fetchedUser.ratio
        },
        message: "Success"
      });
    });
});

router.get('/:id', (req, res, next) => {
  let fetchedUser;
  User.findOne({_id: req.params.id})
  .then(user => {
    fetchedUser = user;
    Prediction.find({userId: user._id, actualWinner: {$ne: null}})
    .sort({gameDate: -1})
    .then(predictions => {
      res.status(200).json({
        userData: {
          username: fetchedUser.username,
          points: fetchedUser.points,
          correct: fetchedUser.correct,
          wrong: fetchedUser.wrong,
          ratio: fetchedUser.ratio
        },
        predictions: predictions,
        message: "Success"
      });
    });
  });
});

router.get("/leaderboard/top", (req, res, next) => {
  User.find()
  .sort({points: -1})
  .then(users => {
    res.status(200).json(users);
  });
});

module.exports = router;
