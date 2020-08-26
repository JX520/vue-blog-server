var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
        tagList:Array,
    categoryList:Array

});

module.exports = mongoose.model('tag',tagSchema)