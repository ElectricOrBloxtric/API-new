const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    id: String,
    name: String,
    createdAt: Date,
    data: Array
});

module.exports = User = mongoose.model("User", UserSchema);