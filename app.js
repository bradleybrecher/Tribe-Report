require('./db');
require('./auth');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');

const Article = mongoose.model('Article');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

const passport = require('passport');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));



// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));


app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({
    extended: false
}));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    if (req.user) {
        // console.log("someone is logged in");
        res.redirect('/feed')
    } else {
        // console.log("Houston, we need to log someone in");
        res.redirect('login');
    }
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


app.post('/register', function(req, res) {
    // way to make sure there is no problem
    User.register(new User({
            username: req.body.username
        }),
        req.body.password,
        function(err, user) {
            if (err) {
                res.render('register', {
                    message: 'Your registration information is not valid'
                });
            } else {
                passport.authenticate('local')(req, res, function() {
                    res.redirect('/');
                });
            }
        });
});

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user) {
        if (user) {
            req.logIn(user, function(err) {
                res.redirect('/');
            });
        } else {
            res.render('login', {
                message: 'Your login or password is incorrect.'
            });
        }
    })(req, res, next);
});

app.get('/post', (req, res) => {
    // TODO: MAKE SURE ALL DB RENDERS ON FIRST CLICK
    if (req.user) {
        // console.log("someone is logged in");
        theUser = req.user;
        theUserID = theUser._id;
        // continue
        Article.find({
            "user": theUserID
        }, function(err, articles) {
            res.render('post', {
                articles: articles
            });
        });
    } else {
        res.redirect('/login');
    }
});

app.get('/feed', (req, res) => {

    if (req.user) {
        // console.log("someone is logged in");
        // continue

        const name = req.query.name;
        theUser = req.user;
        theUserID = theUser._id;
        const theQuery = {
            "name": name,
            "user": theUserID
        };

        if (name) {

            // find which ones contain that name and display them
            Article.find(theQuery, function(err, articles) {
                if (articles.length == 0) {
                    Article.find({
                        "user": theUserID
                    }, function(err, articles) {
                        const str = "No Articles Posted by " + name;
                        res.render('feed', {
                            articles: articles,
                            message: str
                        });

                    });
                } else {
                    res.render('feed', {
                        articles: articles
                    });
                }

            });
        } else {
            // need to make sure this is okay
            Article.find({
                "user": theUserID
            }, function(err, articles) {
                res.render('feed', {
                    articles: articles
                });
            });
        }
    } else {
        // console.log("Houston, we need to log someone in");
        res.redirect('login');
    }

});

app.post('/feed', (req, res) => {

    const obj = req.body;

    let vals = Object.keys(obj).map(function(key) {

        return obj[key];
    });

    // eliminate white space dummy val to query id
    let filteredVals = vals.filter(function(a) {
        return a !== '';
    });

    let keys = Object.keys(obj).map(function(key) {
        return key;
    });

    const theName = vals[0];
    const theComment = vals[1];
    const theID = keys[2];
    // handle comment submissions

    const aComment = new Comment({
        name: theName,
        comment: theComment
    });

    Article.findOneAndUpdate({
            _id: theID
        }, {
            $push: {
                comments: {
                    name: aComment.name,
                    comment: aComment.comment
                }
            }
        }, {
            safe: true,
            upsert: true
        },
        function(err, articles) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/feed');
            }
        }
    );

});


app.post('/post', (req, res) => {

    theName = req.body.name;
    theTitle = req.body.title;
    theLink = req.body.link;
    theComment = req.body.comment;

    theUser = req.user;
    theUserID = theUser._id;

    // TODO: figure out why a post takes one to delay

    const articleToPush = new Article({
        user: theUser,
        name: theName,
        title: theTitle,
        link: theLink,
        comment: theComment

    });
    // first save the article
    articleToPush.save(function(err, article) {
        if (err) {
            console.log(err);

        } else {
            const articleID = article._id;

            // then find the user and update its article list
            User.findOneAndUpdate({
                    "_id": theUserID
                }, {
                    $push: {
                        articles: articleToPush
                    }
                }, {
                    safe: true,
                    upsert: true
                },
                function(err, users) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/feed');

                    }
                }
            );


        }

    });


});



app.listen(process.env.PORT || 3000);