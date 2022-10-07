const app = require('express').Router();
const axios = require('axios').default;
const Game = require('../../models/game');
const User = require('../../models/user');
const Guild = require('../../models/guild');
const Item = require('../../models/item');
setInterval(archiveData, 60000);

function archiveData() {
    if (new Date().getHours() == 7 && new Date().getMinutes() == 0) {
        const date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
        User.find({}, (err, users) => {
            users.forEach(user => {
                axios.get("https://api.polytoria.com/v1/users/user?id=" + user.id + "")
                    .then(function (response) {
                        json = response.data
                        if (json.Errors) {
                            //redo this
                        } else if (json.Success) {
                            json.date = date;
                            let answer = false;
                            user.data.forEach(user2 => {
                                if (user2.date == date) {
                                    answer = true;
                                    return;
                                };
                            });
                            if (answer == false) {
                                user.data.push(json);
                                user.markModified('data');
                                user.save();
                            } else {
                                user.data[user.data.length - 1] = json;
                                user.markModified('data');
                                user.save();
                            }
                        };
                    }).catch(function (error) {
                        
                    })
            });
        });
        Game.find({}, (err, games) => {
            games.forEach(game => {
                axios.get("https://api.polytoria.com/v1/games/info?id=" + game.id + "")
                    .then(function (response) {
                        json = response.data
                        if (json.Errors) {
                            //redo this
                        } else if (json.Success) {
                            json.date = date;
                            let answer = false;
                            game.data.forEach(game2 => {
                                if (game2.date == date) {
                                    answer = true;
                                    return;
                                };
                            });
                            if (answer == false) {
                                game.data.push(json);
                                game.markModified('data');
                                game.save();
                            } else {
                                game.data[game.data.length - 1] = json;
                                game.markModified('data');
                                game.save();
                            }
                        };
                    });
            });
        });
        Guild.find({}, (err, guilds) => {
            guilds.forEach(guild => {
                axios.get("https://api.polytoria.com/v1/guild/info?id=" + guild.id + "")
                    .then(function (response) {
                        json = response.data
                        if (json.Errors) {
                            //redo this
                        } else if (json.Success) {
                            json.date = date;
                            let answer = false;
                            guild.data.forEach(guild2 => {
                                if (guild2.date == date) {
                                    answer = true;
                                    return;
                                };
                            });
                            if (answer == false) {
                                guild.data.push(json);
                                guild.markModified('data');
                                guild.save();
                            } else {
                                guild.data[guild.data.length - 1] = json;
                                guild.markModified('data');
                                guild.save();
                            }
                        };
                    });
            });
        });
        Item.find({}, (err, items) => {
            items.forEach(item => {
                axios.get("https://api.polytoria.com/v1/asset/info?id=" + item.id + "")
                    .then(function (response) {
                        json = response.data
                        json.date = date;
                        if (json.Errors) {
                            //redo this
                        } else if (json.Success) {
                            let answer = false;
                            item.data.forEach(item2 => {
                                if (item2.date == date) {
                                    answer = true;
                                    return;
                                };
                            });
                            if (answer == false) {
                                item.data.push(json);
                                item.markModified('data');
                                item.save();
                            } else {
                                item.data[item.data.length - 1] = json;
                                item.markModified('data');
                                item.save();
                            }
                        };
                    });
            });
        });
    };
}

module.exports = app;