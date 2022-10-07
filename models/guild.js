const mongoose = require("mongoose");
const GuildSchema = mongoose.Schema({
    id: String,
    name: String,
    createdAt: Date,
    data: Array
});

module.exports = Guild = mongoose.model("Guild", GuildSchema);