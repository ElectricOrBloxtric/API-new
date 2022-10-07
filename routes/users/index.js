const app = require('express').Router();
const axios = require('axios').default;
const User = require('../../models/user');
const code = require('../../code.js').code;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] === code) {
            axios.get("https://api.polytoria.com/v1/users/user?id=" + req.params.cid + "")
                .then(function (response) {
                    let json = response.data;
                    json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear();
                    if (json.Errors) {
                        User.findOne({ id: req.params.cid }, (err, user) => {
                            if (err) {
                                res.status(404).json({ 'error': true, 'message': 'User not found.' })
                            } else if (user) {
                                res.status(200).json({
                                    'error': false,
                                    'message': null,
                                    'data': json,
                                    'history': user.data
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
                                res.status(200).json({
                                    'error': false,
                                    'message': null,
                                    'data': json,
                                    'history': user.data
                                });
                            } else {
                                let user = new User({
                                    id: req.params.cid,
                                    name: json.Username,
                                    createdAt: new Date(),
                                    data: [json]
                                });
                                user.save();
                                res.status(200).json({
                                    'error': false,
                                    'message': null,
                                    'data': json,
                                    'history': user.data
                                });
                            };
                        });
                    };
                }).catch(function (error) {
                    res.status(404).json({ 'error': true, 'message': 'User not found.' })
                })
        } else {
            res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
        }
    } else {
        res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
    }
});

module.exports = app;