const mongoose = require('mongoose');

const PredictionSchema = mongoose.Schema({
  gameId: Number,
  gameDate: Date,
  predictedWinner: Number,
  actualWinner: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
