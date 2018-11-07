// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');


// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more articles
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  articles:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

// an article to be posted to the feed
// * items in a list can be deleted or will be automatically deleted month after posted(trust your tribe members)
const Article = new mongoose.Schema({
  name: {type: String, required: true},
  title: {type: String, required: true},
  article: {type: String,  required: true},//check if it a url
  comment: {type: String, required: false},
  createdAt: {type: Date, required: true}// will display at the bottom
}, {
  _id: true
});


