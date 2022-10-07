const axios = require('axios').default;
const User = require('../models/user');

function add(userid) {
    return new Promise(resolve => {
        req = {
            params: {
                cid: userid
            }
        };
        axios.get("https://api.polytoria.com/v1/users/user?id=" + req.params.cid + "")
            .then(function (response) {
                json = response.data;
                json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear();
                if (json.Errors) {
                    User.findOne({ id: req.params.cid }, (err, user) => {
                        if (err) {
                            res.status(404).json({ 'error': true, 'message': 'User not found.' })
                        } else if (user) {
                            resolve({
                                'error': false,
                                'message': null,
                                'data': user.data,
                                'stats': json
                            });
                        } else {
                            res.status(404).json({ 'error': true, 'message': 'User not found.' })
                        };
                    });
                } else if (json.Success) {
                    User.findOne({ id: req.params.cid }, (err, user) => {
                        if (user) {
                            user.name = json.Username;
                            let answer = false;
                            user.data.forEach(user2 => {
                                if (user2.date == ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) {
                                    answer = true;
                                    return;
                                };
                            });
                            if (answer == false) {
                                user.data.push(json);
                                user.save();
                            } else {
                                user.data[user.data.length - 1] = json;
                                user.save();
                            }
                            resolve({
                                'error': false,
                                'message': null,
                                'data': user.data,
                                'stats': json
                            });
                        } else {
                            let user = new User({
                                id: req.params.cid,
                                name: json.Username,
                                createdAt: new Date(),
                                data: [json]
                            });
                            user.save();
                            resolve({
                                'error': false,
                                'message': null,
                                'data': user.data,
                                'stats': json
                            });
                        };
                    });
                };
            }).catch(function (error) {
                resolve({ 'error': true, 'message': 'User not found.' })
            });
    });
};

module.exports = add;