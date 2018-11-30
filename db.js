// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
	articles:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'articleSchema' }]
	// to do make this work for each one
});
const commentSchema = new mongoose.Schema({
	name: {type: String, required: true},
	comment: {type: String, required: false}
});
// an article to be posted to the feed
// * items in a list can be deleted or will be automatically deleted month after posted(trust your tribe members)
const articleSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'userSchema'},
  name: {type: String, required: true},
  title: {type: String, required: true},
  link: {type: String,  required: true},//check if it a url
  comment: {type: String, required: false}, 
  comments: [commentSchema]

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Article', articleSchema);
module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Comment', commentSchema);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if were in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/tribe';
}

// mongoose.connect('mongodb://localhost/tribe');
mongoose.connect(dbconf);