require('./db');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const app = express();


const alert= require('alert-node');

const mongoose = require('mongoose');
const Article = mongoose.model('Article');

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
 			Article.find(function(err, articles) {
		      		console.log('found');
		            res.render('index', {
		                articles: articles
		            });
		        });
});

app.post('/', (req,res)=>{

	 if (validUrl.isUri(req.body.link)){
        console.log('Looks like an URI');
        // perform the post and render
        theName = req.body.name;
        theTitle = req.body.title;
        theLink = req.body.link;
        theComment = req.body.comment;


        const article = new Article({

        	name: theName,
        	title: theTitle,
        	link: theLink,
        	comment: theComment

        });
        article.save(function(err) {
        	if(err){
        		console.log(err);
        		
        	} else {
        		console.log('saved');
        		Article.find(function(err, articles) {
		      		console.log('found');
		            res.render('index', {
		                articles: articles
		            });
		        });
        	}
        	
   		});
      	


    } else {
        console.log('Not a URI');  
		alert("Not a URI: TODO: Integrate with DOM");
    }
});

// app.post('/login', passport.authenticate('local', { successRedirect: '/',
//                                                     failureRedirect: '/login' }));
app.listen(process.env.PORT || 3000);