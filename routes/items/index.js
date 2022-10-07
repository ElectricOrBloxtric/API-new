const app = require('express').Router();
const axios = require('axios').default;
const Item = require('../../models/item');
const code = require('../../code.js').code;
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] === code) {
            axios.get("https://api.polytoria.com/v1/asset/info?id=" + req.params.cid + "")
                .then(function (response) {
                    json = response.data
                    json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
                    if (json.Errors) {
                        res.status(404).json({ 'error': true, 'message': 'Item not found.' })
                    } else if (json.Success) {
                        Item.findOne({ id: req.params.cid }, (err, item) => {
                            if (item) {
                                item.name = json.Name;
                                let answer = false;
                                item.data.forEach(item2 => {
                                    if (item2.date == ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) {
                                        answer = true;
                                        return;
                                    };
                                });
                                if (answer == false) {
                                    item.data.push(json);
                                    item.save();
                                } else {
                                    item.data[item.data.length - 1] = json;
                                    item.save();
                                }
                            } else {
                                let item = new Item({
                                    id: req.params.cid,
                                    name: json.Name,
                                    createdAt: new Date(),
                                    data: [json]
                                });
                                item.save();
                            };
                        });
                        res.status(200).json({
                            'error': false,
                            'message': null,
                            'data': json
                        });
                    };
                }).catch(function (error) {
                    res.status(404).json({ 'error': true, 'message': 'Item not found.' })
                })
        } else {
            res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
        }
    } else {
        res.status(403).json({ 'error': true, 'message': 'Forbidden.' })
    }
});

module.exports = app;