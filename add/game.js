const axios = require('axios').default;
const Game = require('../models/game');

function add(gameid) {
    return new Promise(resolve => {
        req = {
            params: {
                cid: gameid
            }
        };
        axios.get("https://api.polytoria.com/v1/games/info?id=" + req.params.cid + "")
            .then(function (response) {
                json = response.data
                json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
                if (json.Errors) {
                    Game.findOne({ id: req.params.cid }, (err, game) => {
                        if (err) {
                            resolve({ 'error': true, 'message': 'Game not found.' });
                        } else if (game) {
                            resolve({
                                'error': false,
                                'message': null,
                                'stats': json,
                                'data': game.data,
                                'id': game.id
                            });
                        } else {
                            resolve({ 'error': true, 'message': 'Game not found.' });
                        }
                    });
                } else if (json.Success) {
                    Game.findOne({ id: req.params.cid }, (err, game) => {
                        if (game) {
                            game.name = json.name;
                            let answer = false;
                            game.data.forEach(game2 => {
                                if (game2.date == ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) {
                                    answer = true;
                                    return;
                                };
                            });
                            if (answer == false) {
                                game.data.push(json);
                                game.save().catch(err => a = err);
                            } else {
                                game.data[game.data.length - 1] = json;
                                game.save();
                            }
                            resolve({
                                'error': false,
                                'message': null,
                                'stats': json,
                                'data': game.data,
                                'id': game.id
                            });
                        } else {
                            let game = new Game({
                                id: req.params.cid,
                                name: json.name,
                                createdAt: new Date(),
                                data: [json]
                            });
                            game.save().then(() => {
                                resolve({
                                    'error': false,
                                    'message': null,
                                    'stats': [json],
                                    'data': game.data,
                                    'id': game.id
                                });
                            });
                        };
                    });
                } else {
                    resolve({ 'error': true, 'message': 'Game not found.' });
                };
            }).catch(function (error) {
                resolve({ 'error': true, 'message': 'Game not found.' })
            });
    });
};

module.exports = add;