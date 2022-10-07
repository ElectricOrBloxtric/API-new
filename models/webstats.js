const mongoose = require("mongoose");
const WebStatsSchema = mongoose.Schema({
    stats: Object
});

module.exports = WebStats = mongoose.model("WebStats", WebStatsSchema);