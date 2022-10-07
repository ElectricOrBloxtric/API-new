const app = require('express').Router();
const axios = require('axios').default;
const code = require('../../code.js').code;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/:type/:term', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] === code) {
            if (req.params.type == "game") {
                axios.get('https://polytoria.com/api/fetch/games/games?page=0&q=' + req.params.term + '')
                    .then(function (response) {
                        json = response.data
                        if (json.length == 0) {
                            res.status(404).send({ 'error': "No results found." });
                        } else {
                            res.status(200).send(json);
                        }
                    }).catch(function (error) {
                        res.status(404).send({ 'error': "No results found." });
                    });
            } else if (req.params.type == "guild") {
                axios.get('https://polytoria.com/api/fetch/guilds/popularguilds?page=0&q=' + req.params.term + '')
                    .then(function (response) {
                        json = response.data
                        if (json.length == 0) {
                            res.status(404).send({ 'error': "No results found." });
                        } else {
                            res.status(200).send(json);
                        }
                    }).catch(function (error) {
                        res.status(404).send({ 'error': "No results found." });
                    });
            } else if (req.params.type == "item") {
                axios.get('https://polytoria.com/api/fetch/catalog/items?page=0&q=' + req.params.term + '')
                    .then(function (response) {
                        json = response.data
                        if (json.length == 0) {
                            res.status(404).send({ 'error': "No results found." });
                        } else {
                            res.status(200).send(json);
                        }
                    }).catch(function (error) {
                        res.status(404).send({ 'error': "No results found." });
                    });
            } else if (req.params.type == "user") {
                axios.get('https://api.polytoria.com/v1/users/getbyusername?username=' + req.params.term + '')
                    .then(function (response) {
                        json = response.data
                        if (json.Errors) {
                            res.status(404).send({ 'error': "No results found." });
                        } else {
                            res.status(200).send([
                                {
                                    "id": json.ID,
                                    "username": json.Username,
                                    "avatar": json.AvatarHash,
                                    "profileViews": json.ProfileViews,
                                    "forumPosts": json.ForumPosts
                                }
                            ]);
                        }
                    }).catch(function (error) {
                        res.status(404).send({ 'error': "No results found." });
                    });
            } else {
                res.status(404).json({ 'error': true, 'message': 'Invalid search type.' })
            }
        } else {
            res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
        }
    } else {
        res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
    }
});

module.exports = app;