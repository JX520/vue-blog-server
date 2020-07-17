var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//管理员用户
var userSchema = new Schema({
    "user":String,
	"pwd":String,
	"mail":String,
	"type":Number,
});

module.exports = mongoose.model('user',userSchema)