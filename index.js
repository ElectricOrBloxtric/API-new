const app = require('express')();
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('./models/user');
const Game = require('./models/game');
const Guild = require('./models/guild');
const Item = require('./models/item');
const WebStats = require('./models/webstats');
const addUser = require('./add/user.js');
const addGame = require('./add/game.js');
const addGuild = require('./add/guild.js');
const addItem = require('./add/item.js');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const code = require('./code.js').code;
app.use(cookieParser());
let limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 2,
    message: 'rate'
});

app.set('view engine', 'ejs');
mongoose.connect('mongodb://bgtrack:aa6b1b4af025@38.242.133.121:27017/bgtrack?authMechanism=DEFAULT&authSource=admin');
app.get('/login', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] === code) {
            res.redirect('/');
        } else {
            res.render('login');
        }
    } else {
        res.render('login');
    }
});

app.post('/check/code/:code', limiter, (req, res) => {
    if (req.params.code === code) {
        res.cookie('bgtrack', code, {
            maxAge: 1000 * 60 * 60 * 24 * 365
        });
        res.send('true');
    } else {
        res.send('false');
    }
});

app.get('/', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] == code) {
            WebStats.findOne({_id: '62ec7fec252312659344d65d'}, (err, webstats) => {
                if (err) {
                    console.log(err);
                } else {
                    res.render('index', {
                        stats: webstats
                    });
                }
            })
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/user/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] == code) {
            User.findOne({ id: req.params.cid }, (err, user) => {
                if (user) {
                    user.stats = user.data[user.data.length - 1];
                    res.render('user', { user: user });
                } else {
                    User.findOne({ id: req.params.cid }, (err, user) => {
                        if (user) {
                            user.stats = user.data[user.data.length - 1];
                            res.render('user', { user: user });
                        } else {
                            (async () => {
                                let user = await addUser(req.params.cid);
                                if (user.error) {
                                    res.redirect('/');
                                } else {
                                    if (user.error == false) {
                                        res.render('user', { user: user });
                                    } else {
                                        res.redirect('/');
                                    }
                                };
                            })();
                        };
                    });
                };
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/game/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] == code) {
            Game.findOne({ id: req.params.cid }, (err, game) => {
                if (err) {
                    res.redirect('/');
                } else if (game) {
                    game.stats = game.data[game.data.length - 1];
                    res.render('game', { game: game });
                } else {
                    (async () => {
                        let game = await addGame(req.params.cid);
                        if (game.error) {
                            res.redirect('/');
                        } else {
                            if (game) {
                                game.stats = game.data[game.data.length - 1];
                                res.render('game', { game: game });
                            } else {
                                res.redirect('/');
                            }
                        };
                    })();
                };
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/guild/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] == code) {
            Guild.findOne({ id: req.params.cid }, (err, guild) => {
                if (err) {
                    res.redirect('/');
                } else if (guild) {
                    guild.stats = guild.data[guild.data.length - 1];
                    res.render('guild', { guild: guild });
                } else {
                    (async () => {
                        let guild = await addGuild(req.params.cid);
                        if (guild.error) {
                            res.redirect('/');
                        } else {
                            if (guild) {
                                guild.stats = guild.data[guild.data.length - 1];
                                res.render('guild', { guild: guild });
                            } else {
                                res.redirect('/');
                            }
                        };
                    })();
                };
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/item/:cid', (req, res) => {
    if (req.cookies['bgtrack']) {
        if (req.cookies['bgtrack'] == code) {
            Item.findOne({ id: req.params.cid }, (err, item) => {
                if (err) {
                    res.redirect('/');
                } else if (item) {
                    item.stats = item.data[item.data.length - 1];
                    res.render('item', { item: item });
                } else {
                    (async () => {
                        let item = await addItem(req.params.cid);
                        if (item.error) {
                            res.redirect('/');
                        } else {
                            if (item) {
                                item.stats = item.data[item.data.length - 1];
                                res.render('item', { item: item });
                            } else {
                                res.redirect('/');
                            }
                        };
                    })();
                };
            });
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});

app.get('/jquery.js', (req, res) => {
    res.sendFile(__dirname + '/views/js/jquery.js');
});

app.get('/images/banner.png', (req, res) => {
    res.sendFile(__dirname + '/views/images/banner.png');
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/views/images/favicon.ico');
});

app.get('/images/logo.png', (req, res) => {
    res.sendFile(__dirname + '/views/images/logo.png');
});

app.get('/images/search.svg', (req, res) => {
    res.sendFile(__dirname + '/views/images/search.svg');
});

fs.readdir('./routes/games/', (err, files) => {
    files.forEach(file => {
        app.use('/api/games', require('./routes/games/' + file));
    });
});
fs.readdir('./routes/guilds/', (err, files) => {
    files.forEach(file => {
        app.use('/api/guilds', require('./routes/guilds/' + file));
    });
});
fs.readdir('./routes/items/', (err, files) => {
    files.forEach(file => {
        app.use('/api/items', require('./routes/items/' + file));
    });
});
fs.readdir('./routes/users/', (err, files) => {
    files.forEach(file => {
        app.use('/api/users', require('./routes/users/' + file));
    });
});
fs.readdir('./routes/search/', (err, files) => {
    files.forEach(file => {
        app.use('/api/search', require('./routes/search/' + file));
    });
});

function update() {
 User.find({}, (err, users) => {
    Game.find({}, (err, games) => {
        Guild.find({}, (err, guilds) => {
            Item.find({}, (err, items) => {
                WebStats.findOne({
                    _id: "62ec7fec252312659344d65d"
                }).then(stats => {
                    stats.stats = {
                        users: users.length,
                        games: games.length,
                        guilds: guilds.length,
                        items: items.length
                    };
                    stats.save();
                });
            });
        });
    });
 });
}
update()
setInterval(update, 300000);

app.listen(8080)