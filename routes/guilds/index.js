const app = require('express').Router();
const axios = require('axios').default;
const Guild = require('../../models/guild');
const code = require('../../code.js').code;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] === code) {
            axios.get("https://api.polytoria.com/v1/guild/info?id=" + req.params.cid + "")
                .then(function (response) {
                    json = response.data
                    json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
                    if (json.Errors) {
                        res.status(404).json({ 'error': true, 'message': 'Guild not found.' })
                    } else if (json.Success) {
                        Guild.findOne({ id: req.params.cid }, (err, guild) => {
                            if (guild) {
                                guild.name = json.Name;
                                let answer = false;
                                guild.data.forEach(guild2 => {
                                    if (guild2.date == ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) {
                                        answer = true;
                                        return;
                                    };
                                });
                                if (answer == false) {
                                    guild.data.push(json);
                                    guild.save();
                                } else {
                                    guild.data[guild.data.length - 1] = json;
                                    guild.save();
                                }
                            } else {
                                let guild = new Guild({
                                    id: req.params.cid,
                                    name: json.Name,
                                    createdAt: new Date(),
                                    data: [json]
                                });
                                guild.save();
                            };
                        });
                        res.status(200).json({
                            'error': false,
                            'message': null,
                            'data': json
                        });
                    };
                }).catch(function (error) {
                    res.status(404).json({ 'error': true, 'message': 'Guild not found.' })
                })
        } else {
            res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
        }
    } else {
        res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
    }
});

module.exports = app;