const mongoose = require("mongoose");
const GameSchema = mongoose.Schema({
    id: String,
    name: String,
    createdAt: Date,
    data: Array
});

module.exports = Game = mongoose.model("Game", GameSchema);