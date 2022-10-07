const app = require('express').Router();
const axios = require('axios').default;
const Game = require('../../models/game');
const code = require('../../code.js').code;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] === code) {
            axios.get("https://api.polytoria.com/v1/games/info?id=" + req.params.cid + "")
                .then(function (response) {
                    json = response.data
                    json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
                    if (json.Errors) {
                        res.status(404).json({ 'error': true, 'message': 'Game not found.' })
                    } else if (json.Success) {
                        Game.findOne({ id: req.params.cid }, (err, game) => {
                            if (game) {
                                game.name = json.Name;
                                let answer = false;
                                game.data.forEach(game2 => {
                                    if (game2.date == ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) {
                                        answer = true;
                                        return;
                                    };
                                });
                                if (answer == false) {
                                    game.data.push(json);
                                    game.save();
                                } else {
                                    game.data[game.data.length - 1] = json;
                                    game.save();
                                }
                                res.status(200).json({
                                    'error': false,
                                    'message': null,
                                    'data': json,
                                    'history': game.data
                                });
                            } else {
                                let game = new Game({
                                    id: req.params.cid,
                                    name: json.Name,
                                    createdAt: new Date(),
                                    data: [json]
                                });
                                game.save();
                                res.status(200).json({
                                    'error': false,
                                    'message': null,
                                    'data': json,
                                    'history': game.data
                                });
                            };
                        });
                    };
                }).catch(function (error) {
                    res.status(404).json({ 'error': true, 'message': 'Game not found.' })
                })
        } else {
            res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
        }
    } else {
        res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
    }
});

module.exports = app;