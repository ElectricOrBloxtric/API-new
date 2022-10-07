const mongoose = require("mongoose");
const ItemSchema = mongoose.Schema({
    id: String,
    name: String,
    createdAt: Date,
    data: Array
});

module.exports = Item = mongoose.model("Item", ItemSchema);