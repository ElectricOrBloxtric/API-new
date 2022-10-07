const axios = require('axios').default;
const Guild = require('../models/guild');

function add(guildid) {
    return new Promise(resolve => {
        req = {
            params: {
                cid: guildid
            }
        };
        axios.get("https://api.polytoria.com/v1/guild/info?id=" + req.params.cid + "")
            .then(function (response) {
                json = response.data
                json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
                if (json.Errors) {
                    Guild.findOne({ id: req.params.cid }, (err, guild) => {
                        if (err) {
                            resolve({ 'error': true, 'message': 'Guild not found.' });
                        } else if (guild) {
                            resolve({
                                'error': false,
                                'message': null,
                                'stats': json,
                                'data': guild.data,
                                'id': guild.id
                            });
                        } else {
                            resolve({ 'error': true, 'message': 'Guild not found.' });
                        }
                    });
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
                                guild.save().catch(err => a = err);
                            } else {
                                guild.data[guild.data.length - 1] = json;
                                guild.save();
                            }
                            resolve({
                                'error': false,
                                'message': null,
                                'stats': json,
                                'data': guild.data,
                                'id': guild.id
                            });
                        } else {
                            let guild = new Guild({
                                id: req.params.cid,
                                name: json.Name,
                                createdAt: new Date(),
                                data: [json]
                            });
                            guild.save().then(() => {
                                resolve({
                                    'error': false,
                                    'message': null,
                                    'stats': [json],
                                    'data': guild.data,
                                    'id': guild.id
                                });
                            });
                        };
                    });
                } else {
                    resolve({ 'error': true, 'message': 'Guild not found.' });
                };
            }).catch(function (error) {
                resolve({ 'error': true, 'message': 'Guild not found.' })
            });
    });
};

module.exports = add;