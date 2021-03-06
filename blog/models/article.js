var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    "id":Number,
	"title":String,
	"brief":String,
	"publishTime":String,
	"updateTime":String,
	"category":String,
	"lables":Array,
	"likeNum":Number,
	"reviewNum":Number,
	"detail":String,
	"review":[
		{
			"userName":String,
			"reviewTime":String,
			"content":String,
			"userImg":String
		}
	],
	"watchNum":Number
});

module.exports = mongoose.model('article',articleSchema)

