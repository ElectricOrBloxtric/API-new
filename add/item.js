const axios = require('axios').default;
const Item = require('../models/item');

function add(itemid) {
    return new Promise(resolve => {
        req = {
            params: {
                cid: itemid
            }
        };
        axios.get("https://api.polytoria.com/v1/asset/info?id=" + req.params.cid + "")
            .then(function (response) {
                json = response.data
                json.date = ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
                if (json.Errors) {
                    Item.findOne({ id: req.params.cid }, (err, item) => {
                        if (err) {
                            resolve({ 'error': true, 'message': 'Item not found.' });
                        } else if (item) {
                            resolve({
                                'error': false,
                                'message': null,
                                'stats': json,
                                'data': item.data
                            });
                        } else {
                            resolve({ 'error': true, 'message': 'Item not found.' });
                        }
                    });
                } else if (json.Success) {
                    Item.findOne({ id: req.params.cid }, (err, item) => {
                        if (item) {
                            item.name = json.name;
                            let answer = false;
                            item.data.forEach(item2 => {
                                if (item2.date == ((new Date().getMonth()) + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()) {
                                    answer = true;
                                    return;
                                };
                            });
                            if (answer == false) {
                                item.data.push(json);
                                item.save().catch(err => a = err);
                            } else {
                                item.data[item.data.length - 1] = json;
                                item.save();
                            }
                            resolve({
                                'error': false,
                                'message': null,
                                'stats': json,
                                'data': item.data
                            });
                        } else {
                            let item = new Item({
                                id: req.params.cid,
                                name: json.name,
                                createdAt: new Date(),
                                data: [json]
                            });
                            item.save().then(() => {
                                resolve({
                                    'error': false,
                                    'message': null,
                                    'stats': [json],
                                    'data': item.data,
                                    'id': item.id
                                });
                            });
                        };
                    });
                } else {
                    resolve({ 'error': true, 'message': 'Item not found.' });
                };
            }).catch(function (error) {
                resolve({ 'error': true, 'message': 'Item not found.' })
            });
    });
};

module.exports = add;